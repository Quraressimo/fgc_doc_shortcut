import sqlite3
from pathlib import Path


def main() -> None:
	# 이 스크립트와 같은 DB 폴더에 있는 스키마와 샘플 SQL을 사용합니다.
	base_dir = Path(__file__).resolve().parent
	db_path = base_dir / "fgc.db"
	schema_path = base_dir / "tables.sql"
	crud_path = base_dir / "crud.sql"

	with sqlite3.connect(db_path) as conn:
		conn.row_factory = sqlite3.Row

		# 최신 테이블 구조와 제약 조건을 확실히 적용하기 위해 테이블을 다시 만듭니다.
		conn.execute("DROP TABLE IF EXISTS guides")
		conn.executescript(schema_path.read_text(encoding="utf-8"))

		# crud.sql의 INSERT 문을 실행해 예시 공략 데이터를 입력합니다.
		conn.execute("DELETE FROM guides")
		conn.executescript(crud_path.read_text(encoding="utf-8"))
		conn.commit()

		# 입력 결과를 조회해 콘솔에서 데이터가 정상적으로 저장되었는지 확인합니다.
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
