# fgc_doc_shortcut
업데이트 현황은 HISTORY.md 혹은 Releases, Commits 페이지를 참고하세요

## 프로젝트 소개
ai활용프로그래밍 프로젝트용이에요
### 파일 구조
#### HTML
- `index.html`: 공략 검색 화면을 구성합니다.
- `script.js`: 태그 필터와 공략 카드 출력을 처리합니다.
- `style.css`: 웹페이지의 화면 스타일을 정의합니다.
- `guides-data.js`: SQLite DB에서 변환된 공략 데이터를 저장합니다.

#### DB
- `tables.sql`: `guides` 테이블의 구조를 정의합니다.
- `crud.sql`: 공략 데이터를 DB에 입력합니다.
- `fgc.db`: 공략 데이터가 저장된 SQLite 데이터베이스입니다.
- `apply_sql.py`: `tables.sql`과 `crud.sql`로 `guides` 테이블을 재생성합니다.
- `only_db_read.py`: SQLite 데이터베이스를 읽기 전용으로 조회해 콘솔에 출력합니다.
- `export_guides.py`: SQLite 데이터를 `HTML/guides-data.js`로 변환합니다.

## 설치법
https://github.com/Quraressimo/fgc_doc_shortcut/releases

Releases 페이지로 들어가 최신 Releases의 Asset에서 fgc_doc_shortcut_XXXX.zip 확장자 파일을 다운 받아 압축을 풀어주세요.

<img width="644" height="471" alt="image" src="https://github.com/user-attachments/assets/58052ccb-07e7-4704-aeb1-f483a607da48" />

## 사용법
`crud.sql`을 수정해 DB에 반영할 때는 다음 명령을 실행합니다.

    py DB\apply_sql.py
    py DB\export_guides.py

`apply_sql.py`는 `guides` 테이블을 삭제하고 SQL 파일 기준으로 다시 만듭니다.
따라서 DB에 직접 추가한 `guides` 행은 유지되지 않습니다. 기존 DB 내용을 콘솔에서
확인하려면 `py DB\only_db_read.py`를 실행하세요.

페이지의 `공략 추가용 SQL 만들기`에서 공략 정보를 입력하면 `INSERT` 문을 생성할 수
있습니다. 생성된 문을 `DB\crud.sql`에 추가한 뒤 위 두 명령을 실행하면 DB와 웹페이지
데이터가 갱신됩니다. 그 다음 `HTML\index.html`을 브라우저에서 직접 열면 됩니다.

## 실행 화면 스크린샷