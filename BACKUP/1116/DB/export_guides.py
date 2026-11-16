import json
import sqlite3
from pathlib import Path


# 프로젝트 루트와 입력/출력 파일의 위치를 한 곳에서 관리합니다.
BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "DB" / "fgc.db"
OUTPUT_PATH = BASE_DIR / "HTML" / "guides-data.js"

# 각 태그를 화면의 필터 그룹으로 분류하기 위한 기준 목록입니다.
# 이 값은 script.js의 태그 그룹과 같은 이름과 태그를 사용해야 검색이 일치합니다.
TAG_GROUPS = {
    "difficulty": {"~브론즈", "~골드", "~다이아", "~투신"},
    "situation": {"뉴트럴", "대공", "카운터", "월브레이크", "압박", "기상"},
    "location": {"개막", "구석", "근거리", "중거리", "원거리"},
    "category": {"콤보", "셋업", "운영", "기초", "대처법", "공용"},
    "type": {"텐션 50%", "텐션 100%"},
}


def main() -> None:
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
        for group_name, group_options in TAG_GROUPS.items():
            # 화면에서 그룹별 필터를 적용할 수 있도록 태그를 그룹별 배열로도 저장합니다.
            guide[group_name] = [
                tag for tag in tags if tag in group_options
            ]
        guides.append(guide)

    # JavaScript가 file:// 환경에서 직접 읽을 수 있도록 전역 변수 대입문으로 저장합니다.
    data = json.dumps(guides, ensure_ascii=False, indent=4)
    for guide in guides:
        for field_name in ("tags", *TAG_GROUPS):
            values = guide[field_name]
            if not values:
                continue

            formatted_array = (
                f'"{field_name}": [\n'
                + ",\n".join(
                    f"            {json.dumps(value, ensure_ascii=False)}"
                    for value in values
                )
                + "\n        ]"
            )
            compact_array = (
                f'"{field_name}": {json.dumps(values, ensure_ascii=False)}'
            )
            data = data.replace(formatted_array, compact_array, 1)

    OUTPUT_PATH.write_text(f"window.GUIDES = {data};\n", encoding="utf-8")
    print(f"Exported {len(guides)} guides to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
