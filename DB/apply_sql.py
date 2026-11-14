import sqlite3
from contextlib import closing
from pathlib import Path


def main() -> None:
	base_dir = Path(__file__).resolve().parent
	db_path = base_dir / "fgc.db"
	schema_path = base_dir / "tables.sql"
	crud_path = base_dir / "crud.sql"

	schema_sql = schema_path.read_text(encoding="utf-8")
	crud_sql = crud_path.read_text(encoding="utf-8")
	script = f"""
	BEGIN IMMEDIATE;
	DROP TABLE IF EXISTS guides;
	{schema_sql}
	{crud_sql}
	COMMIT;
	"""

	with closing(sqlite3.connect(db_path)) as conn:
		try:
			conn.executescript(script)
		except sqlite3.Error:
			if conn.in_transaction:
				conn.rollback()
			raise

		total_rows = conn.execute("SELECT COUNT(*) FROM guides").fetchone()[0]

	print(f"DB: {db_path}")
	print(f"Total rows applied: {total_rows}")


if __name__ == "__main__":
	main()
