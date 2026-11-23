# fgc_doc_shortcut
업데이트 현황은 HISTORY.md 혹은 Releases, Commits 페이지를 참고하세요

해당 코드들은 Github Copilot, ChatGPT AI를 사용해 작성했습니다.

## 프로젝트 소개
ai활용프로그래밍 프로젝트용이에요.

`fgc_doc_shortcut`은 길티기어 -스트라이브- 공략을 빠르게 찾아볼 수 있도록 만든 웹페이지입니다.
캐릭터, 플랫폼, 공략 유형과 태그를 조합하거나 제목으로 검색해 원하는 공략 링크를 찾을 수 있습니다.
검색 결과는 카드 형태로 표시되며, 선택하면 원본 공략을 새 탭에서 엽니다.

페이지는 별도의 웹 서버 없이 브라우저에서 바로 실행할 수 있습니다.
공략 추가 폼으로 공략 정보를 입력해 SQL 문을 만들 수 있고, 필터 설정과 공략 데이터는 SQLite 데이터베이스를 바탕으로 관리합니다.

### 파일 구조
#### HTML
- `index.html`: 공략 검색 화면을 구성합니다.
- `style.css`: 웹페이지의 화면 스타일을 정의합니다.
- `javascript/`: 브라우저 JavaScript 파일을 보관합니다.
  - `app-state.js`: 페이지 요소와 필터 설정 및 상태를 준비합니다.
  - `guide-form.js`: 공략 추가 폼, 자동 완성, SQL 생성 기능을 처리합니다.
  - `filter-ui.js`: 필터 선택지와 필터 검색을 처리합니다.
  - `guide-list.js`: 검색 조건에 맞는 공략 카드와 결과 안내를 출력합니다.
  - `script.js`: 검색, 폼, 페이지 버튼 이벤트를 연결하고 초기 화면을 렌더링합니다.
  - `guides-data.js`: SQLite DB에서 변환된 공략 데이터를 저장합니다.

#### DB
- `filter-groups.json`: 태그 그룹, 플랫폼, 캐릭터 분류와 ID 구간을 정의합니다.
- `fgc.db`: 공략 데이터가 저장된 SQLite 데이터베이스입니다.
- `sql/`: 데이터베이스 스키마와 SQL 데이터를 보관합니다.
  - `tables.sql`: `guides` 테이블의 구조를 정의합니다.
  - `crud.sql`: 공략 데이터를 DB에 입력합니다.
- `python/`: DB 재생성과 조회, JavaScript 데이터 내보내기 스크립트를 보관합니다.
  - `apply_sql.py`: `sql/tables.sql`과 `sql/crud.sql`로 `guides` 테이블을 재생성합니다.
  - `only_db_read.py`: SQLite 데이터베이스를 읽기 전용으로 조회해 콘솔에 출력합니다.
  - `export_guides.py`: SQLite 데이터를 `HTML/javascript/guides-data.js`로 변환합니다.

## 실행 환경 & 필요한 패키지
- 운영체제: Windows 10/11
- Python 3.9 이상: DB 재생성, 데이터 내보내기, 자동 테스트 실행에 사용합니다.
    - Python 외부 패키지는 필요하지 않습니다. SQLite와 테스트 모듈은 Python 표준 라이브러리를 사용합니다.
- 웹 브라우저: Chromium 기반 최신 브라우저 권장. 별도 웹 서버 없이 `HTML\index.html`을 열어 실행할 수 있습니다.
- Node.js: 테스트 케이스 검증에만 필요합니다. 실 사용에는 필요하지 않습니다.

## 설치법

### Python 설치

DB 재생성, 데이터 내보내기, 테스트 실행을 사용하려면 Python 3.9 이상을 설치합니다.

1. Microsoft Store에서 `Python 3.9 이상` 버전을 설치하거나 [python.org 다운로드 페이지](https://www.python.org/downloads/windows/)에서 Windows용 Python 설치 파일을 내려받아 실행합니다.
2. python.org 설치 파일을 사용할 경우 설치 화면의 `Add python.exe to PATH` 옵션을 선택합니다.
3. 설치가 끝난 뒤 새 터미널을 열고 다음 명령으로 설치를 확인합니다.

        py --version

표시된 버전이 3.9 이상이면 준비가 완료됩니다. Python 외부 패키지는 필요하지 않습니다.

Windows 패키지 관리자(`winget`)를 사용할 수도 있습니다.

    winget install -e --id Python.Python.3.13

위 명령은 예시이며, 다른 지원 버전을 설치하려면 Python의 공식 winget 패키지 ID를 사용하세요.

### 프로젝트 다운로드

https://github.com/Quraressimo/fgc_doc_shortcut/releases

Releases 페이지로 들어가 최신 Releases의 Asset에서 fgc_doc_shortcut_XXXX.zip 확장자 파일을 다운 받아 압축을 풀어주세요.

<img width="644" height="471" alt="image" src="https://github.com/user-attachments/assets/58052ccb-07e7-4704-aeb1-f483a607da48" />

## 사용법
### 공략 추가
`DB\sql\crud.sql`에서 직접 SQL문을 작성하거나,
`HTML\index.html`을 브라우저에서 직접 연 뒤 페이지의 `공략 추가`버튼에서 공략 정보를 입력하면 `INSERT` 문을 생성할 수 있습니다.
생성된 문을 `DB\sql\crud.sql`에 추가한 뒤 DB에 반영할 때는 다음 명령을 실행합니다.

    py DB\python\apply_sql.py
    py DB\python\export_guides.py

위 두 명령을 실행하면 DB와 웹페이지 데이터가 갱신됩니다.

`apply_sql.py`는 `guides` 테이블을 삭제하고 SQL 파일 기준으로 다시 만듭니다.
따라서 DB에 직접 추가한 `guides` 행은 유지되지 않습니다. 기존 DB 내용을 콘솔에서 확인하려면 `py DB\python\only_db_read.py`를 실행하세요.

### 필터 추가
필터 설정을 수정할 때는 `DB\filter-groups.json`을 편집한 뒤 `py DB\python\export_guides.py`를 실행하세요.
이 스크립트가 설정을 `HTML\javascript\guides-data.js`에 포함하므로, 기존 그룹에 태그를 추가하거나 새 그룹을 추가할 때 Python/JavaScript/HTML을 함께 수정할 필요가 없습니다.

다크모드, 선택한 필터와 필터 그룹의 접힘/펼침 상태는 브라우저에 저장되어 다음 방문에도 유지됩니다.

### 테스트 실행 방법
저장소 루트 폴더에서 다음 명령을 실행합니다.

    py tests\test_copy_workspace.py

테스트는 `DB`와 `HTML`을 임시 폴더에 복사해 실행하므로 원본 `DB\fgc.db`와 파일을 변경하지 않습니다.
테스트별 실행·통과·실패 상태가 콘솔에 표시됩니다.
Node.js가 설치되어 있으면 폼 검증 테스트도 실행하며, 설치되어 있지 않으면 해당 테스트만 건너뜁니다.

검색, 필터, 추가 폼 등 브라우저 화면 동작은 `HTML\index.html`을 열어 수동으로 확인합니다.
테스트 항목과 기대 결과는 [tests\TEST_CASES.md](tests/TEST_CASES.md)를 참고하세요.

## MVP - 최소 구현
- [x] 태그 필터 및 검색
    - [x] 필터 항목 검색: 필터 이름 일부나 한글 초성으로 원하는 캐릭터·플랫폼·태그를 찾습니다.
    - [x] 조건 조합 검색: 같은 그룹에서는 선택 조건 중 하나라도 일치하면 포함하고, 서로 다른 그룹과 제목 검색은 모두 만족하는 결과를 표시합니다.
    - [x] 검색 결과 확인: 제목, 캐릭터, 출처, 태그를 카드로 보여주고 선택하면 원본 공략 링크를 새 탭에서 엽니다.
- [x] 캐릭터별 필터링: 기본 캐릭터와 시즌 패스 그룹으로 분류합니다.
- [x] 출처(플랫폼)별 필터링: YouTube, X, dcinside, 아카라이브, 기타로 공략을 찾습니다.
- [x] 유형 및 태그별 필터링: 난이도, 분류, 상황, 위치, 유형 태그를 선택해 검색합니다.
    
## 계획 변경 사항
- 없음
- 편의성 계열 기능 추가만 있습니다.
- 중간 대비 추가 사항
    - 공략 제목 검색 : 필터 검색 이외에도 제목만 검색해 빠르게 찾을 수 있게 했습니다.
    - 공략 추가 폼 : 태그가 늘어남에 따라 SQL에 일일히 작성하기 힘들어 간편하게 SQL을 작성할 수 있는 폼을 만들었습니다.
    - 필터 UI 개선 : 항목이 많아져 서브 필터별로 접기/펼치기가 가능하고, 초성, 부분 검색으로 빠른 필터링이 가능하게 했습니다.
    - URL 추가 : 공식 홈페이지, 공략사이트 등 URL을 추가했습니다.
    - 다크 모드 추가 : 어둡게 페이지를 볼 수 있게 버튼을 추가했습니다.
    - 검색 필터 저장: 로컬 저장으로 다크 모드, 필터 항목을 저장했습니다.

## 실행 화면 스크린샷.
<img width="2301" height="754" alt="image" src="https://github.com/user-attachments/assets/176c85ed-bfe8-4be9-80d6-0089386c7b80" />

<img width="2300" height="1283" alt="image" src="https://github.com/user-attachments/assets/c0a78106-66c4-4b94-b3ac-fe1c3e2cbae1" />

<img width="294" height="376" alt="image" src="https://github.com/user-attachments/assets/3ad65d65-49aa-4bc6-bdc2-4ea1830991ec" />

<img width="694" height="714" alt="image" src="https://github.com/user-attachments/assets/8cb43d0b-3723-473d-941d-639c2da1cc77" />
