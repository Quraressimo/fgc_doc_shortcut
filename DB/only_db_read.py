import sqlite3
from contextlib import closing
from pathlib import Path

def main() -> None:
	# 이 스크립트와 같은 DB 폴더에 있는 데이터베이스를 읽습니다.
	base_dir = Path(__file__).resolve().parent
	db_path = base_dir / "fgc.db"

	with closing(
		sqlite3.connect(f"{db_path.as_uri()}?mode=ro", uri=True)
	) as conn:
		conn.row_factory = sqlite3.Row

		rows = conn.execute(
			"""
			SELECT id, url, title, chara, platform, tag1, tag2, tag3, tag4, tag5
			FROM guides
			ORDER BY id
			"""
		).fetchall()

	print(f"DB: {db_path}")
	print(f"Total rows: {len(rows)}")
	for row in rows:
		# 제목, 플랫폼, URL, 5개 태그를 한 줄로 출력합니다.
		print(
			f"[{row['id']}] "
			f"{(row['title'] or '').strip() or (row['chara'] or '').strip() + ' 공략'} | "
			f"{row['platform']} | {row['url']} | "
			f"tags=({row['tag1']}, {row['tag2']}, {row['tag3']}, {row['tag4']}, {row['tag5']})"
		)

if __name__ == "__main__":
	main()