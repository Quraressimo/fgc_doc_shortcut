# fgc_doc_shortcut
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
## 실행 화면 스크린샷 권장


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

## 11월 04일 수
공략 검색 화면과 출력 방식을 개선했습니다.

    공략별 제목을 직접 지정할 수 있도록 title 필드를 추가했습니다.
    캐릭터가 비어 있는 공략은 공용으로 표시하도록 수정했습니다.
    플랫폼 이름을 YouTube, X, dcinside, 아카라이브, 기타로 통일했습니다.
    공략 카드에 캐릭터, 플랫폼, 태그를 표시하도록 구성했습니다.
    태그를 난이도, 분류, 상황, 위치, 유형 순서로 정렬했습니다.
    태그를 다섯 칸으로 고정하고 빈 태그는 공란으로 표시했습니다.
    결과 태그를 그룹별 배경색이 있는 배지로 표시했습니다.
    캐릭터, 플랫폼, 태그 필터를 접었다 펼 수 있도록 변경했습니다.
    필터 검색 중에는 필터를 자동으로 펼치도록 수정했습니다.
    필터 선택 후 검색 전의 접힘 및 펼침 상태를 유지하도록 수정했습니다.
    필터를 체크박스 대신 선택 상태가 표시되는 버튼으로 변경했습니다.
    한글 태그를 초성으로 검색할 수 있도록 추가했습니다.
    결과 수에 따른 스크롤 변화를 줄이기 위해 결과 영역의 최소 높이를 설정했습니다.
