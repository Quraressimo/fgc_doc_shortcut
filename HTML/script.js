// 화면에서 반복해서 사용하는 DOM 요소를 먼저 찾아 둡니다.
// 이후 렌더링 함수는 이 요소의 내용만 교체해 전체 페이지를 다시 로드하지 않습니다.
const tagSearchInput = document.querySelector("#tag-search-input");
const guideTitleSearchInput = document.querySelector("#guide-title-search-input");
const guideList = document.querySelector("#guide-list");
const searchStatus = document.querySelector("#search-status");
const backToTopButton = document.querySelector("#back-to-top");
const guideForm = document.querySelector("#guide-form");
const sqlOutputArea = document.querySelector(".sql-output-area");
const sqlOutput = document.querySelector("#sql-output");
const copySqlButton = document.querySelector("#copy-sql-button");
const sqlStatus = document.querySelector("#sql-status");
const sqlGeneratorDialog = document.querySelector("#sql-generator-dialog");
const openSqlGeneratorButton = document.querySelector("#open-sql-generator");
const closeSqlGeneratorButton = document.querySelector("#close-sql-generator");
const guideIdInput = document.querySelector("#guide-id-input");
const guidePlatformInput = document.querySelector("#guide-platform-input");

// 플랫폼별 ID 구간의 시작 번호입니다. 같은 구간 안에서 뒤의 번호는 직접 조정합니다.
const platformIdPrefixes = {
    YouTube: 0,
    X: 1000,
    dcinside: 2000,
    아카라이브: 3000,
    기타: 9000
};

// 시즌별 DLC 캐릭터 목록입니다.
// 캐릭터 필터를 기본 캐릭터와 시즌 패스로 나누어 표시할 때 사용합니다.
const seasonPassCharacters = {
    1: ["골드루이스 디킨슨", "잭 오", "해피 케이오스", "바이켄", "테스타먼트"],
    2: ["브리짓", "신 키스크", "베드맨?", "아스카 R#"],
    3: ["죠니", "엘페르트 밸런타인", "A.B.A", "슬레이어"],
    4: ["퀸 디지", "베놈", "유니카", "루시"],
    5: ["쿠라도베리 잼", "로보카이"]
};

const filterGroups = {
    character: {
        // 캐릭터 전체를 접거나 펼칠 수 있는 details 요소입니다.
        container: document.querySelector("#character-filter-category"),
        subfilters: [
            {
                key: "character",
                // 기본 캐릭터 목록과 해당 목록을 감싸는 fieldset입니다.
                list: document.querySelector("#base-character-filter-list"),
                container: document.querySelector("#base-character-filter-list").closest("fieldset"),
                options: [
                    "솔 배드가이", "카이 키스크", "메이", "액슬 로우", "치프 자너프",
                    "포템킨", "파우스트", "밀리아 레이지", "자토 ONE", "램리썰 밸런타인",
                    "레오 화이트팽", "나고리유키", "지오바나", "안지 미토", "이노"
                ],
                characterType: "base"
            },
            ...Object.entries(seasonPassCharacters).map(([seasonPass, options]) => {
                // 시즌 번호를 HTML의 목록 ID와 연결해 반복적인 설정을 줄입니다.
                const list = document.querySelector(`#season-pass-${seasonPass}-filter-list`);
                return {
                    key: "character",
                    list,
                    container: list.closest("fieldset"),
                    options,
                    characterType: "dlc",
                    seasonPass: Number(seasonPass)
                };
            })
        ]
    },
    platform: {
        // 플랫폼은 하나의 목록으로 표시되지만 캐릭터/태그와 같은 필터 그룹으로 취급합니다.
        container: document.querySelector("#platform-filter-category"),
        list: document.querySelector("#platform-filter-list"),
        options: ["YouTube", "X", "dcinside", "아카라이브", "기타"]
    },
    tags: {
        // 태그 전체 그룹 내부에 난이도·분류·상황·위치·유형 하위 그룹이 있습니다.
        container: document.querySelector("#tag-filter-category"),
        list: document.querySelector("#tag-filter-list"),
        options: [],
        subfilters: [
            {
                key: "difficulty",
                container: document.querySelector("#difficulty-filter-group"),
                list: document.querySelector("#difficulty-filter-list"),
                options: ["~브론즈", "~골드", "~다이아", "~투신"]
            },
            {
                key: "category",
                container: document.querySelector("#category-filter-group"),
                list: document.querySelector("#category-filter-list"),
                options: ["콤보", "셋업", "운영", "기초", "대처법", "공용"]
            },
            {
                key: "situation",
                container: document.querySelector("#situation-filter-group"),
                list: document.querySelector("#situation-filter-list"),
                options: ["뉴트럴", "대공", "카운터", "월브레이크", "압박", "기상"]
            },
            {
                key: "location",
                container: document.querySelector("#location-filter-group"),
                list: document.querySelector("#location-filter-list"),
                options: ["개막", "구석", "근거리", "중거리", "원거리"]
            },
            {
                key: "type",
                container: document.querySelector("#type-filter-group"),
                list: document.querySelector("#type-filter-list"),
                options: ["텐션 50%", "텐션 100%", ]
            }
        ]
    }
};

// guides-data.js에서 DB 내용을 미리 생성해 제공합니다.
// 데이터가 없거나 파일이 로드되지 않은 경우 빈 배열로 안전하게 시작합니다.
let guides = Array.isArray(window.GUIDES) ? window.GUIDES : [];

// 선택된 필터는 검색 입력값과 별도로 보존합니다.
// 같은 그룹의 선택지는 OR, 서로 다른 그룹의 선택지는 AND 조건으로 사용됩니다.
const selectedFilters = {
    character: new Set(),
    platform: new Set(),
    tags: new Set(),
    difficulty: new Set(),
    situation: new Set(),
    location: new Set(),
    category: new Set(),
    type: new Set()
};

// 검색을 시작하기 전 details의 접힘/펼침 상태를 임시 저장합니다.
// 검색어를 지운 뒤 사용자가 보던 상태를 복원하기 위한 값입니다.
let filterOpenStateBeforeSearch = null;
let previousSearchQuery = "";

// 결과 카드의 태그를 어떤 필터 그룹으로 볼지 정의합니다.
// 색상 클래스와 결과 표시 순서도 이 분류를 사용합니다.
const tagGroups = {
    difficulty: new Set(["~브론즈", "~골드", "~다이아", "~투신"]),
    category: new Set(["콤보", "셋업", "운영", "기초", "대처법", "공용"]),
    situation: new Set(["뉴트럴", "대공", "카운터", "월브레이크", "압박", "기상"]),
    location: new Set(["개막", "구석", "근거리", "중거리", "원거리"]),
    type: new Set(["텐션 50%", "텐션 100%"])
};
const tagGroupOrder = ["difficulty", "category", "situation", "location", "type"];

// 하나의 태그가 속한 그룹 이름을 반환합니다.
// 알 수 없는 값은 other로 분류해 렌더링이 중단되지 않게 합니다.
function getTagGroup(tag) {
    return Object.entries(tagGroups)
        .find(([, options]) => options.has(tag))?.[0] ?? "other";
}

// DB 입력 순서와 관계없이 결과 태그를 화면 표시 순서로 정렬합니다.
function getSortedTags(tags) {
    return tagGroupOrder.flatMap((groupName) =>
        tags.filter((tag) => getTagGroup(tag) === groupName)
    );
}

// 현재 필터 그룹에서 화면에 보여줄 선택지 목록을 계산합니다.
// 기본 옵션과 실제 데이터에 포함된 동적 옵션을 합쳐 중복을 제거합니다.
function getOptions(groupName, baseOptions, subfilter) {
    const relevantGuides = subfilter?.characterType
        ? guides.filter((guide) =>
            (guide.characterType ?? "base") === subfilter.characterType
            && (subfilter.characterType !== "dlc"
                || Number(guide.seasonPass) === subfilter.seasonPass)
        )
        : guides;
    const valueField = subfilter?.characterType ? "character" : groupName;
    const guideValues = relevantGuides.flatMap((guide) => {
        const value = guide[valueField];
        return Array.isArray(value) ? value : value ? [value] : [];
    });

    return [...new Set([...baseOptions, ...guideValues])];
}

// 검색창의 공백을 제거하고 대소문자 영향을 줄인 검색어를 반환합니다.
function getSearchQuery() {
    return tagSearchInput.value.trim().toLocaleLowerCase();
}

// 한글 완성형 문자를 초성으로 변환합니다.
// 예를 들어 '대처법'은 'ㄷㅊㅂ'으로 변환되어 초성 검색에 사용됩니다.
function getKoreanInitials(value) {
    const initialConsonants = [
        "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ",
        "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"
    ];

    return [...value].map((character) => {
        const code = character.charCodeAt(0) - 0xac00;
        if (code < 0 || code > 11171) return character;
        return initialConsonants[Math.floor(code / 588)];
    }).join("");
}

// SQL 문자열 안의 작은따옴표를 SQLite 문자열 표기 방식에 맞게 이스케이프합니다.
function escapeSqlValue(value) {
    return value.replaceAll("'", "''");
}

// 입력 폼의 값을 읽어 guides 테이블용 INSERT 문으로 변환합니다.
function createGuideInsertSql() {
    const values = [
        document.querySelector("#guide-id-input").value.trim(),
        document.querySelector("#guide-url-input").value.trim(),
        document.querySelector("#guide-title-input").value.trim(),
        document.querySelector("#guide-character-input").value.trim(),
        document.querySelector("#guide-platform-input").value,
        ...[1, 2, 3, 4, 5].map((index) =>
            document.querySelector(`#guide-tag-${index}-input`).value.trim()
        )
    ];
    const sqlValues = values.map((value, index) =>
        index === 0 ? value : `'${escapeSqlValue(value)}'`
    );

    return `INSERT INTO guides (id, url, title, chara, platform, tag1, tag2, tag3, tag4, tag5) VALUES\n`
        + `\t(${sqlValues.join(", ")});`;
}

// 생성된 SQL을 클립보드에 복사하고, 브라우저 권한이 없으면 직접 선택할 수 있게 합니다.
async function copyGeneratedSql() {
    try {
        await navigator.clipboard.writeText(sqlOutput.value);
        sqlStatus.textContent = "SQL을 클립보드에 복사했습니다.";
    } catch (error) {
        console.error(error);
        sqlOutput.select();
        sqlStatus.textContent = "자동 복사에 실패했습니다. 선택된 SQL을 직접 복사하세요.";
    }
}

// 필터 선택 상태를 추가하거나 제거한 뒤 관련 화면을 다시 렌더링합니다.
function updateSelectedFilter(selection, option, checked) {
    if (checked) {
        selection.add(option);
    } else {
        selection.delete(option);
    }

    // 선택 후 검색어를 비워 다른 필터 선택지를 다시 표시합니다.
    tagSearchInput.value = "";
    renderFilters();
    renderGuides();
}

// 하나의 상위 필터 그룹을 렌더링하고, 선택지가 없는 하위 그룹은 숨깁니다.
function renderFilterGroup(groupName) {
    const group = filterGroups[groupName];
    let hasMatchingOptions = false;

    if (group.list) {
        hasMatchingOptions = renderOptionList(groupName, group.list, group.options);
    }

    for (const subfilter of group.subfilters ?? []) {
        const hasMatchingSubfilter = renderOptionList(
            subfilter.key,
            subfilter.list,
            subfilter.options,
            subfilter
        );
        subfilter.container.hidden = !hasMatchingSubfilter;
        hasMatchingOptions = hasMatchingOptions || hasMatchingSubfilter;
    }

    group.container.hidden = !hasMatchingOptions;
}

// 검색어에 맞는 버튼 목록을 생성합니다.
// 체크박스 대신 aria-pressed를 사용하는 토글 버튼으로 선택 상태를 표현합니다.
function renderOptionList(filterName, list, presetOptions, subfilter) {
    const query = getSearchQuery();
    const options = getOptions(filterName, presetOptions, subfilter);
    const matchingOptions = options.filter((option) =>
        option.toLocaleLowerCase().includes(query)
        || getKoreanInitials(option).includes(query)
    );

    list.replaceChildren();

    if (matchingOptions.length === 0) {
        return false;
    }

    for (const option of matchingOptions) {
        const item = document.createElement("li");
        const button = document.createElement("button");
        const isSelected = selectedFilters[filterName].has(option);

        button.type = "button";
        button.className = `filter-option filter-option-${filterName}`;
        button.textContent = option;
        button.setAttribute("aria-pressed", String(isSelected));
        button.addEventListener("click", () => {
            updateSelectedFilter(
                selectedFilters[filterName],
                option,
                !selectedFilters[filterName].has(option)
            );
        });

        item.append(button);
        list.append(item);
    }

    return true;
}

// 캐릭터·플랫폼·태그 필터 전체를 갱신합니다.
function renderFilters() {
    const searchQuery = getSearchQuery();
    const hasSearchQuery = searchQuery !== "";

    if (hasSearchQuery && previousSearchQuery === "") {
        filterOpenStateBeforeSearch = Object.fromEntries(
            Object.entries(filterGroups).map(([groupName, group]) => [
                groupName,
                group.container.open
            ])
        );
    }

    if (hasSearchQuery) {
        for (const group of Object.values(filterGroups)) {
            group.container.open = true;
        }
    } else if (previousSearchQuery !== "" && filterOpenStateBeforeSearch) {
        for (const [groupName, wasOpen] of Object.entries(filterOpenStateBeforeSearch)) {
            filterGroups[groupName].container.open = wasOpen;
        }
        filterOpenStateBeforeSearch = null;
    }

    for (const groupName of Object.keys(filterGroups)) {
        renderFilterGroup(groupName);
    }

    previousSearchQuery = searchQuery;
}

// 선택된 필터를 기준으로 공략을 걸러내고 결과 카드를 출력합니다.
function renderGuides() {
    const hasSelectedFilters = Object.values(selectedFilters)
        .some((options) => options.size > 0);
    const titleSearchQuery = guideTitleSearchInput.value.trim().toLocaleLowerCase();
    const hasTitleSearch = titleSearchQuery !== "";
    const matchingGuides = !hasSelectedFilters && !hasTitleSearch
        ? []
        : guides.filter((guide) => {
            // 제목 검색과 필터를 함께 사용하면 두 조건을 모두 만족하는 공략만 보여줍니다.
            const matchesTitle = !hasTitleSearch
                || (guide.title ?? "").toLocaleLowerCase().includes(titleSearchQuery);
            const matchesFilters = Object.entries(selectedFilters).every(
                ([groupName, selectedOptions]) => {
                    if (selectedOptions.size === 0) return true;

                    const guideValue = guide[groupName];
                    const guideOptions = Array.isArray(guideValue)
                        ? guideValue
                        : guideValue ? [guideValue] : [];

                    return [...selectedOptions].some((option) =>
                        guideOptions.includes(option)
                    );
                }
            );

            return matchesTitle && matchesFilters;
        });

    guideList.replaceChildren();

    for (const guide of matchingGuides) {
        // 카드 전체를 링크로 사용해 제목·캐릭터·플랫폼·태그 어느 곳을 눌러도 이동합니다.
        const item = document.createElement("li");
        const card = document.createElement("a");
        const character = document.createElement("span");
        const platform = document.createElement("span");
        const tags = document.createElement("span");

        card.href = guide.url;
        card.target = "_blank";
        card.rel = "noopener noreferrer";
        card.className = "guide-card";

        const title = document.createElement("span");
        title.className = "guide-link";
        title.textContent = guide.title;
        character.className = "guide-character";
        character.textContent = guide.character?.trim() || "공용";
        platform.className = "guide-platform";
        platform.textContent = guide.platform;
        tags.className = "guide-tags";
        const sortedTags = getSortedTags(guide.tags ?? []);
        // 카드 레이아웃을 유지하기 위해 태그는 항상 5칸을 만듭니다.
        for (const tag of Array.from({ length: 5 }, (_, index) =>
            sortedTags[index] ?? ""
        )) {
            const tagItem = document.createElement("span");
            // 그룹별 클래스가 태그 배경색을 결정합니다. 빈 칸도 동일한 공간을 차지합니다.
            tagItem.className = `guide-tag guide-tag-${getTagGroup(tag)}`;
            tagItem.textContent = tag;
            tags.append(tagItem);
        }
        card.append(title, character, platform, tags);
        item.append(card);
        guideList.append(item);
    }

    // 결과가 없는 경우, 필터 선택 여부에 따라 사용자에게 다른 안내를 표시합니다.
    if (guides.length === 0) {
        searchStatus.textContent = "등록된 공략이 없습니다.";
    } else if (!hasSelectedFilters && !hasTitleSearch) {
        searchStatus.textContent =
            `현재 저장된 공략은 ${guides.length}개입니다. 필터를 선택하면 공략을 확인할 수 있습니다.`;
    } else if (matchingGuides.length === 0) {
        searchStatus.textContent = "검색 조건에 해당하는 공략이 없습니다.";
    } else {
        searchStatus.textContent = `${matchingGuides.length}개의 공략을 찾았습니다.`;
    }
}

// 화면 상단 이동 버튼은 접근성 설정에 따라 부드러운 이동 여부를 결정합니다.
tagSearchInput.addEventListener("input", renderFilters);
guideTitleSearchInput.addEventListener("input", renderGuides);
guidePlatformInput.addEventListener("change", () => {
    guideIdInput.value = platformIdPrefixes[guidePlatformInput.value];
});
openSqlGeneratorButton.addEventListener("click", () => {
    sqlGeneratorDialog.showModal();
});
closeSqlGeneratorButton.addEventListener("click", () => {
    sqlGeneratorDialog.close();
});
sqlGeneratorDialog.addEventListener("click", (event) => {
    if (event.target === sqlGeneratorDialog) {
        sqlGeneratorDialog.close();
    }
});
guideForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sqlOutput.value = createGuideInsertSql();
    sqlOutputArea.hidden = false;
    sqlStatus.textContent = "crud.sql에 붙여 넣을 INSERT 문이 생성되었습니다.";
});
copySqlButton.addEventListener("click", copyGeneratedSql);
backToTopButton.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth"
    });
});
renderFilters();
renderGuides();