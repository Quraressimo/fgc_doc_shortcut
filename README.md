# fgc_doc_shortcut
ai활용프로그래밍 프로젝트용이에요

### HTML
- `guides-data.js`: SQLite DB에서 변환된 공략 데이터를 저장합니다.

### DB

- `tables.sql`: `guides` 테이블의 구조를 정의합니다.
- `crud.sql`: 공략 예시 데이터를 DB에 입력합니다.
- `fgc.db`: 공략 데이터가 저장된 SQLite 데이터베이스입니다.
- `read_db.py`: 테이블을 생성하고 `crud.sql`의 데이터를 DB에 입력합니다.
- `export_guides.py`: SQLite 데이터를 `HTML/guides-data.js`로 변환합니다.

## 10월 29일 목
USB를 분실했기 때문에 작업물이 모두 날아가 다시 작업합니다.

    웹페이지 관련 파일index.html, script.js, style.css 파일을 생성했습니다.
    sqlite 관련 파일 tables.sql, crud.sql, read_db.py 파일을 생성했습니다.
    BACKUP 폴더를 추가했습니다.
    DB, HTML 폴더를 분리해 구분하기 쉽게 했습니다.

## 11월 03일 화
db와 예시 등등을 추가해 실제 검색이 되게 해봤습니다.

    DB에 예시 데이터를 추가했습니다.
    필터 태그들을 수정했습니다.
    유용한 외부 링크들을 추가했습니다.

## 실행 방법

서버 없이 HTML 파일을 직접 열려면 먼저 DB 내용을 JS 데이터 파일로 변환합니다.

    py DB\read_db.py
    py DB\export_guides.py

그 다음 `HTML\index.html`을 브라우저에서 직접 열면 됩니다.
`crud.sql`의 예시 데이터를 갱신한 경우에는 위 두 명령을 다시 실행합니다.
