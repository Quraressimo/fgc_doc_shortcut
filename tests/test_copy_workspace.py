import hashlib
import json
import os
import shutil
import sqlite3
import subprocess
import sys
import tempfile
import unittest
from contextlib import closing
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]


def file_hash(path: Path) -> str:
    """테스트 중 원본 DB가 바뀌었는지 확인할 수 있도록 파일 해시를 반환합니다."""
    return hashlib.sha256(path.read_bytes()).hexdigest()


class CopiedWorkspaceTests(unittest.TestCase):
    """DB를 변경하는 작업은 임시 DB·HTML 복사본에서만 실행합니다."""

    @classmethod
    def setUpClass(cls) -> None:
        cls.temp_directory = tempfile.TemporaryDirectory()
        cls.addClassCleanup(cls.temp_directory.cleanup)
        cls.workspace = Path(cls.temp_directory.name) / "workspace"
        # 스크립트가 자신의 위치에서 DB·HTML 경로를 찾으므로 두 폴더를 함께 복사합니다.
        shutil.copytree(PROJECT_ROOT / "DB", cls.workspace / "DB")
        shutil.copytree(PROJECT_ROOT / "HTML", cls.workspace / "HTML")
        cls.original_db_hash = file_hash(PROJECT_ROOT / "DB" / "fgc.db")

        for script_name in ("apply_sql.py", "export_guides.py"):
            script = cls.workspace / "DB" / "python" / script_name
            subprocess.run(
                [sys.executable, str(script)],
                cwd=cls.workspace,
                check=True,
                capture_output=True,
                text=True,
            )

    def test_rebuild_and_export_match_the_copied_database(self) -> None:
        """복사본에서 재생성한 DB 행과 브라우저 내보내기 데이터의 일치를 확인합니다."""
        database_path = self.workspace / "DB" / "fgc.db"
        generated_data_path = (
            self.workspace / "HTML" / "javascript" / "guides-data.js"
        )
        generated_data = generated_data_path.read_text(encoding="utf-8")
        config_marker = "window.GUIDE_CONFIG = "
        guides_marker = ";\nwindow.GUIDES = "

        self.assertIn(
            config_marker,
            generated_data,
            "내보낸 파일에 GUIDE_CONFIG 설정이 있어야 합니다.",
        )
        config_json, guides_json = generated_data.split(guides_marker, 1)
        config = json.loads(config_json.split(config_marker, 1)[1])
        guides = json.loads(guides_json.strip().removesuffix(";"))

        with closing(sqlite3.connect(database_path)) as connection:
            rows = connection.execute(
                """
                SELECT id, url, title, chara, platform, tag1, tag2, tag3, tag4, tag5
                FROM guides
                ORDER BY id
                """
            ).fetchall()

        self.assertEqual(
            len(guides),
            len(rows),
            "내보낸 가이드 수와 복사 DB의 행 수가 같아야 합니다.",
        )
        self.assertEqual(
            [guide["id"] for guide in guides],
            [row[0] for row in rows],
            "내보낸 가이드 ID는 DB 순서와 일치해야 합니다.",
        )
        self.assertEqual(
            guides[0]["character"],
            "공용",
            "캐릭터가 비어 있는 가이드는 공용으로 내보내야 합니다.",
        )
        for guide in guides:
            for group_name, group_config in config["tagGroups"].items():
                expected_tags = [
                    tag for tag in guide["tags"] if tag in group_config["tags"]
                ]
                self.assertEqual(
                    guide[group_name],
                    expected_tags,
                    f"가이드 {guide['id']}의 {group_name} 태그가 필터 설정과 일치해야 합니다.",
                )

    def test_copied_database_rejects_blank_required_tags(self) -> None:
        """DB 제약이 빈 태그와 공백뿐인 필수 태그를 모두 거부하는지 확인합니다."""
        database_path = self.workspace / "DB" / "fgc.db"
        with closing(sqlite3.connect(database_path)) as connection:
            for guide_id, tag in ((91000, ""), (91001, "   ")):
                with self.subTest(tag=repr(tag)):
                    with self.assertRaises(sqlite3.IntegrityError):
                        connection.execute(
                            """
                            INSERT INTO guides
                                (id, url, title, chara, platform, tag1)
                            VALUES (?, ?, ?, ?, ?, ?)
                            """,
                            (
                                guide_id,
                                "https://example.com/guide",
                                "test",
                                "",
                                "test",
                                tag,
                            ),
                        )

    def test_form_accepts_only_configured_values_and_nonblank_text(self) -> None:
        """미등록 값과 공백 입력은 거부하고 공용 가이드 입력은 허용하는지 확인합니다."""
        node = shutil.which("node")
        if node is None:
            self.skipTest("폼 입력 검증 실행에는 Node.js가 필요합니다.")

        script = r"""
const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const createField = () => ({
    value: "",
    validationMessage: "",
    setCustomValidity(message) { this.validationMessage = message; }
});
const title = createField();
const character = createField();
const tags = Array.from({ length: 5 }, createField);
const context = {
    GUIDE_TITLE_INPUT: title,
    GUIDE_CHARACTER_INPUT: character,
    GUIDE_TAG_INPUTS: tags,
    GUIDE_CHARACTER_OPTIONS: ["등록된 캐릭터"],
    GUIDE_TAG_OPTIONS: ["기초", "콤보"],
    GUIDE_CHARACTER_OPTION_SET: new Set(["등록된 캐릭터"]),
    GUIDE_TAG_OPTION_SET: new Set(["기초", "콤보"])
};
vm.createContext(context);
vm.runInContext(fs.readFileSync(process.env.FORM_JS_PATH, "utf8"), context);
const validate = context.validateGuideForm;

title.value = "테스트 공략";
tags[0].value = "기초";
assert.equal(validate(), true, "선택 입력은 비워 두어도 유효해야 합니다.");

character.value = "미등록 캐릭터";
assert.equal(validate(), false, "필터에 없는 캐릭터는 거부되어야 합니다.");
character.value = "등록된 캐릭터";
tags[1].value = "미등록 태그";
assert.equal(validate(), false, "필터에 없는 태그는 거부되어야 합니다.");

tags[1].value = "   ";
assert.equal(validate(), false, "공백뿐인 선택 태그는 거부되어야 합니다.");
tags[1].value = "";
character.value = "   ";
assert.equal(validate(), false, "공백뿐인 캐릭터 입력은 거부되어야 합니다.");
character.value = "";
title.value = "   ";
assert.equal(validate(), false, "공백뿐인 제목은 거부되어야 합니다.");
title.value = "테스트 공략";
tags[0].value = "   ";
assert.equal(validate(), false, "공백뿐인 필수 태그는 거부되어야 합니다.");
"""
        environment = os.environ.copy()
        environment["FORM_JS_PATH"] = str(
            self.workspace / "HTML" / "javascript" / "guide-form.js"
        )
        result = subprocess.run(
            [node, "-e", script],
            cwd=self.workspace,
            env=environment,
            capture_output=True,
            text=True,
        )
        self.assertEqual(
            result.returncode,
            0,
            "복사한 HTML 코드의 폼 검증이 실패했습니다.\n"
            + result.stdout
            + result.stderr,
        )

    def test_failed_sql_application_rolls_back_the_copied_database(self) -> None:
        """잘못된 CRUD SQL 실행이 실패하고 복사본 DB를 롤백하는지 확인합니다."""
        with tempfile.TemporaryDirectory() as temp_dir:
            failure_workspace = Path(temp_dir) / "workspace"
            shutil.copytree(self.workspace, failure_workspace)
            database_path = failure_workspace / "DB" / "fgc.db"
            crud_path = failure_workspace / "DB" / "sql" / "crud.sql"

            with closing(sqlite3.connect(database_path)) as connection:
                original_ids = connection.execute(
                    "SELECT id FROM guides ORDER BY id"
                ).fetchall()

            crud_path.write_text(
                crud_path.read_text(encoding="utf-8")
                + "\nINSERT INTO missing_test_table VALUES (1);\n",
                encoding="utf-8",
            )
            result = subprocess.run(
                [
                    sys.executable,
                    str(failure_workspace / "DB" / "python" / "apply_sql.py"),
                ],
                cwd=failure_workspace,
                capture_output=True,
                text=True,
            )

            self.assertNotEqual(
                result.returncode,
                0,
                "잘못된 CRUD SQL은 성공으로 처리되면 안 됩니다.",
            )
            self.assertIn(
                "no such table",
                result.stderr.lower(),
                "실패 원인이 잘못된 테이블 SQL로 표시되어야 합니다.",
            )
            with closing(sqlite3.connect(database_path)) as connection:
                remaining_ids = connection.execute(
                    "SELECT id FROM guides ORDER BY id"
                ).fetchall()
            self.assertEqual(
                remaining_ids,
                original_ids,
                "SQL 적용 실패 후 기존 가이드 데이터가 롤백되어야 합니다.",
            )

    def test_invalid_filter_json_keeps_the_previous_export(self) -> None:
        """잘못된 필터 JSON은 오류 처리하고 기존 내보내기 파일을 보존하는지 확인합니다."""
        with tempfile.TemporaryDirectory() as temp_dir:
            failure_workspace = Path(temp_dir) / "workspace"
            shutil.copytree(self.workspace, failure_workspace)
            config_path = failure_workspace / "DB" / "filter-groups.json"
            output_path = (
                failure_workspace / "HTML" / "javascript" / "guides-data.js"
            )
            previous_output = output_path.read_bytes()
            config_path.write_text("{ invalid json", encoding="utf-8")

            result = subprocess.run(
                [
                    sys.executable,
                    str(failure_workspace / "DB" / "python" / "export_guides.py"),
                ],
                cwd=failure_workspace,
                capture_output=True,
                text=True,
            )

            self.assertNotEqual(
                result.returncode,
                0,
                "잘못된 JSON 설정은 내보내기 성공으로 처리되면 안 됩니다.",
            )
            self.assertIn(
                "JSONDecodeError",
                result.stderr,
                "사용자가 설정 파일 문법 오류를 확인할 수 있어야 합니다.",
            )
            self.assertEqual(
                output_path.read_bytes(),
                previous_output,
                "설정 파싱 실패 시 기존 내보내기 파일을 보존해야 합니다.",
            )

    def test_original_database_is_unchanged(self) -> None:
        """DB 스크립트 실행 후 원본 DB 파일이 변경되지 않았는지 확인합니다."""
        self.assertEqual(
            file_hash(PROJECT_ROOT / "DB" / "fgc.db"),
            self.original_db_hash,
            "테스트 실행 중 원본 DB 파일은 변경되면 안 됩니다.",
        )


class ExplainingTestResult(unittest.TextTestResult):
    """각 테스트의 설명과 결과를 한국어로 즉시 콘솔에 출력합니다."""

    def write_message(
        self,
        status: str,
        test: unittest.case.TestCase,
        detail: str = "",
    ) -> None:
        description = test.shortDescription() or test.id()
        suffix = f" — {detail}" if detail else ""
        self.stream.writeln(f"[{status}] {description}{suffix}")
        self.stream.flush()

    def write_result(
        self,
        status: str,
        test: unittest.case.TestCase,
        detail: str = "",
    ) -> None:
        self.write_message(status, test, detail)
        self.stream.writeln()
        self.stream.flush()

    def startTest(self, test: unittest.case.TestCase) -> None:
        super().startTest(test)
        self.write_message("실행", test)

    def addSuccess(self, test: unittest.case.TestCase) -> None:
        super().addSuccess(test)
        self.write_result("통과", test)

    def addFailure(self, test: unittest.case.TestCase, err: object) -> None:
        super().addFailure(test, err)
        self.write_result("실패", test)

    def addError(self, test: unittest.case.TestCase, err: object) -> None:
        super().addError(test, err)
        self.write_result("오류", test)

    def addSkip(self, test: unittest.case.TestCase, reason: str) -> None:
        super().addSkip(test, reason)
        self.write_result("건너뜀", test, reason)


if __name__ == "__main__":
    runner = unittest.TextTestRunner(
        stream=sys.stdout,
        verbosity=0,
        resultclass=ExplainingTestResult,
    )
    unittest.main(testRunner=runner)
