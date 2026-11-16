import json
import sqlite3
from pathlib import Path


# 프로젝트 루트와 입력/출력 파일의 위치를 한 곳에서 관리합니다.
BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "DB" / "fgc.db"
TAG_GROUPS_PATH = BASE_DIR / "DB" / "tag-groups.json"
OUTPUT_PATH = BASE_DIR / "HTML" / "guides-data.js"


def main() -> None:
    tag_groups = json.loads(TAG_GROUPS_PATH.read_text(encoding="utf-8"))

    # SQLite 행을 사전처럼 다루기 위해 Row factory를 사용합니다.
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        rows = connection.execute(
            """
            SELECT id, url, title, chara, platform, tag1, tag2, tag3, tag4, tag5
            FROM guides
            ORDER BY id
            """
        ).fetchall()

    guides = []
    for row in rows:
        # DB에는 tag1~tag5가 별도 컬럼으로 저장되므로 빈 값은 제외해 배열로 합칩니다.
        tags = [row[f"tag{index}"] for index in range(1, 6) if row[f"tag{index}"]]
        guide = {
            "id": row["id"],
            "url": row["url"],
            # 직접 입력한 제목을 우선하고, 제목이 없으면 캐릭터 기반 기본 제목을 사용합니다.
            "title": (
                (row["title"] or "").strip()
                or f"{(row['chara'] or '').strip()} 공략".strip()
                or "공략"
            ),
            # 캐릭터가 비어 있는 공용 공략은 화면에서 '공용'으로 표시합니다.
            "character": (row["chara"] or "").strip() or "공용",
            "platform": row["platform"],
            "tags": tags,
        }
        for group_name, group_config in tag_groups.items():
            # 화면에서 그룹별 필터를 적용할 수 있도록 태그를 그룹별 배열로도 저장합니다.
            guide[group_name] = [
                tag for tag in tags if tag in group_config["tags"]
            ]
        guides.append(guide)

    # 설정과 데이터 모두 스크립트로 내보내 file:// 환경에서도 사용할 수 있게 합니다.
    config_data = json.dumps({"tagGroups": tag_groups}, ensure_ascii=False, indent=4)
    guides_data = json.dumps(guides, ensure_ascii=False, indent=4)
    OUTPUT_PATH.write_text(
        f"window.GUIDE_CONFIG = {config_data};\n"
        f"window.GUIDES = {guides_data};\n",
        encoding="utf-8",
    )
    print(f"Exported {len(guides)} guides to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
