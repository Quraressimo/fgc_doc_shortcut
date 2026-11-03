import json
import sqlite3
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "DB" / "fgc.db"
OUTPUT_PATH = BASE_DIR / "HTML" / "guides-data.js"
TAG_GROUPS = {
    "difficulty": {"~브론즈", "~골드", "~다이아", "~투신"},
    "situation": {"뉴트럴", "대공", "카운터", "월브레이크", "압박", "기상"},
    "location": {"개막", "구석", "근거리", "중거리", "원거리"},
    "category": {"콤보", "셋업", "운영", "기초", "대처법"},
    "type": {"텐션 50%", "텐션 100%"},
}


def main() -> None:
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        rows = connection.execute(
            """
            SELECT id, url, chara, platform, tag1, tag2, tag3, tag4, tag5
            FROM guides
            ORDER BY id
            """
        ).fetchall()

    guides = []
    for row in rows:
        tags = [row[f"tag{index}"] for index in range(1, 6) if row[f"tag{index}"]]
        guide = {
            "id": row["id"],
            "url": row["url"],
            "title": f"{row['chara']} 공략",
            "character": row["chara"],
            "platform": row["platform"],
            "tags": tags,
        }
        for group_name, group_options in TAG_GROUPS.items():
            guide[group_name] = [
                tag for tag in tags if tag in group_options
            ]
        guides.append(guide)

    data = json.dumps(guides, ensure_ascii=False, indent=4)
    OUTPUT_PATH.write_text(f"window.GUIDES = {data};\n", encoding="utf-8")
    print(f"Exported {len(guides)} guides to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
