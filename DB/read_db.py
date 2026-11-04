import sqlite3
from pathlib import Path


def main() -> None:
	base_dir = Path(__file__).resolve().parent
	db_path = base_dir / "fgc.db"
	schema_path = base_dir / "tables.sql"
	crud_path = base_dir / "crud.sql"

	with sqlite3.connect(db_path) as conn:
		conn.row_factory = sqlite3.Row

		# Recreate the table so latest constraints are always applied.
		conn.execute("DROP TABLE IF EXISTS guides")
		conn.executescript(schema_path.read_text(encoding="utf-8"))

		# Load sample rows.
		conn.execute("DELETE FROM guides")
		conn.executescript(crud_path.read_text(encoding="utf-8"))
		conn.commit()

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
		print(
			f"[{row['id']}] "
			f"{(row['title'] or '').strip() or (row['chara'] or '').strip() + ' 공략'} | "
			f"{row['platform']} | {row['url']} | "
			f"tags=({row['tag1']}, {row['tag2']}, {row['tag3']}, {row['tag4']}, {row['tag5']})"
		)


if __name__ == "__main__":
	main()
