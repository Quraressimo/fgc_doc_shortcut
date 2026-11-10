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
- `read_db.py`: 테이블을 생성하고 `crud.sql`의 데이터를 DB에 입력합니다.
- `export_guides.py`: SQLite 데이터를 `HTML/guides-data.js`로 변환합니다.

## 설치법
https://github.com/Quraressimo/fgc_doc_shortcut/releases

Releases 페이지로 들어가 최신 Releases의 Asset에서 fgc_doc_shortcut_XXXX.zip 확장자 파일을 다운 받아 압축을 풀어주세요.

<img width="644" height="471" alt="image" src="https://github.com/user-attachments/assets/58052ccb-07e7-4704-aeb1-f483a607da48" />

## 사용법
서버 없이 HTML 파일을 직접 열려면 먼저 DB 내용을 JS 데이터 파일로 변환합니다.

    py DB\read_db.py
    py DB\export_guides.py

그 다음 `HTML\index.html`을 브라우저에서 직접 열면 됩니다.
`crud.sql`의 예시 데이터를 갱신한 경우에는 위 두 명령을 다시 실행합니다.

페이지의 `공략 추가용 SQL 만들기`에서 공략 정보를 입력하면 `INSERT` 문을 생성할 수
있습니다. 생성된 문을 `DB\crud.sql`에 추가한 뒤 위의 두 명령을 다시 실행하면 DB와
웹페이지 데이터가 갱신됩니다.

## 실행 화면 스크린샷