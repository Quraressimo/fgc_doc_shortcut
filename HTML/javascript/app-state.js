// 화면에서 반복해서 사용하는 DOM 요소를 먼저 찾아 둡니다.
// 이후 렌더링 함수는 이 요소의 내용만 교체해 전체 페이지를 다시 로드하지 않습니다.
const TAG_SEARCH_INPUT = document.querySelector("#tag-search-input");
const GUIDE_TITLE_SEARCH_INPUT = document.querySelector("#guide-title-search-input");
const GUIDE_LIST = document.querySelector("#guide-list");
const SEARCH_STATUS = document.querySelector("#search-status");
const BACK_TO_TOP_BUTTON = document.querySelector("#back-to-top");
const GUIDE_FORM = document.querySelector("#guide-form");
const SQL_OUTPUT_AREA = document.querySelector(".sql-output-area");
const SQL_OUTPUT = document.querySelector("#sql-output");
const COPY_SQL_BUTTON = document.querySelector("#copy-sql-button");
const SQL_STATUS = document.querySelector("#sql-status");
const SQL_GENERATOR_DIALOG = document.querySelector("#sql-generator-dialog");
const OPEN_SQL_GENERATOR_BUTTON = document.querySelector("#open-sql-generator");
const CLOSE_SQL_GENERATOR_BUTTON = document.querySelector("#close-sql-generator");
const GUIDE_ID_INPUT = document.querySelector("#guide-id-input");
const GUIDE_ID_HELP = document.querySelector("#guide-id-help");
const GUIDE_PLATFORM_INPUT = document.querySelector("#guide-platform-input");
const GUIDE_CHARACTER_INPUT = document.querySelector("#guide-character-input");
const GUIDE_TAG_INPUTS = [1, 2, 3, 4, 5].map((index) => document.querySelector(`#guide-tag-${index}-input`));
const FILTER_CONFIG = window.GUIDE_CONFIG;
const TAG_GROUPS = FILTER_CONFIG.tagGroups;
const TAG_GROUP_ORDER = Object.keys(TAG_GROUPS);
const PLATFORM_CONFIG = FILTER_CONFIG.platforms;
const PLATFORM_ID_CONFIG = new Map(
    PLATFORM_CONFIG.map((platform) => [platform.name, platform])
);
const CHARACTER_CONFIG = FILTER_CONFIG.characters;

// 설정 파일의 태그 그룹을 화면에 표시할 하위 필터와 목록 요소로 만듭니다.
const TAG_FILTER_SUBFILTERS = Object.entries(TAG_GROUPS).map(
    ([key, { label, tags }]) => {
        const container = document.createElement("fieldset");
        const legend = document.createElement("legend");
        const list = document.createElement("ul");

        container.id = `${key}-filter-group`;
        container.className = "tag-subfilter";
        legend.textContent = label;
        list.id = `${key}-filter-list`;
        list.className = "tag-filter-list";
        container.append(legend, list);
        document.querySelector("#tag-filter-subfilters").append(container);

        return { key, container, list, options: tags };
    }
);

// JavaScript는 "1" 같은 숫자형 키를 먼저 열거하므로 기본 그룹을 명시적으로 앞으로 옮깁니다.
const CHARACTER_GROUP_ENTRIES = Object.entries(CHARACTER_CONFIG);
const ORDERED_CHARACTER_GROUP_ENTRIES = [
    ...CHARACTER_GROUP_ENTRIES.filter(([group]) => group === "base"),
    ...CHARACTER_GROUP_ENTRIES.filter(([group]) => group !== "base")
];
const CHARACTER_GROUPS = Object.fromEntries(
    ORDERED_CHARACTER_GROUP_ENTRIES.map(([group, config]) => [group, config.tags])
);
// 캐릭터 이름에서 소속 그룹을 빠르게 찾을 수 있도록 역방향 조회표를 만듭니다.
const CHARACTER_GROUP_BY_NAME = new Map(
    Object.entries(CHARACTER_GROUPS).flatMap(([group, characters]) =>
        characters.map((character) => [character, group])
    )
);

const CHARACTER_FILTER_SUBFILTERS = document.querySelector("#character-filter-subfilters");
const CHARACTER_SUBFILTERS = ORDERED_CHARACTER_GROUP_ENTRIES.map(([group, config]) => {
    const container = document.createElement("fieldset");
    const legend = document.createElement("legend");
    const list = document.createElement("ul");

    container.className = "tag-subfilter";
    container.hidden = false;
    legend.textContent = config.label;
    list.id = group === "base"
        ? "base-character-filter-list"
        : `season-pass-${group}-filter-list`;
    list.className = "tag-filter-list";
    container.append(legend, list);
    CHARACTER_FILTER_SUBFILTERS.append(container);

    return {
        key: "character",
        list,
        container,
        options: config.tags,
        characterGroup: group
    };
});

for (const platform of PLATFORM_CONFIG) {
    const option = document.createElement("option");
    option.value = platform.name;
    option.textContent = platform.name;
    GUIDE_PLATFORM_INPUT.append(option);
}

const FILTER_GROUPS = {
    character: {
        // 캐릭터 전체를 접거나 펼칠 수 있는 details 요소입니다.
        container: document.querySelector("#character-filter-category"),
        subfilters: CHARACTER_SUBFILTERS
    },
    platform: {
        // 플랫폼은 하나의 목록으로 표시되지만 캐릭터/태그와 같은 필터 그룹으로 취급합니다.
        container: document.querySelector("#platform-filter-category"),
        list: document.querySelector("#platform-filter-list"),
        options: PLATFORM_CONFIG.map((platform) => platform.name)
    },
    tags: {
        // 태그 전체 그룹 내부에 난이도·분류·상황·위치·유형 하위 그룹이 있습니다.
        container: document.querySelector("#tag-filter-category"),
        subfilters: TAG_FILTER_SUBFILTERS
    }
};

// guides-data.js에서 DB 내용을 미리 생성해 제공합니다.
// 데이터가 없거나 파일이 로드되지 않은 경우 빈 배열로 안전하게 시작합니다.
let guides = Array.isArray(window.GUIDES) ? window.GUIDES : [];

// 선택된 필터는 검색 입력값과 별도로 보존합니다.
// 같은 그룹의 선택지는 OR, 서로 다른 그룹의 선택지는 AND 조건으로 사용됩니다.
const SELECTED_FILTERS = {
    character: new Set(),
    platform: new Set(),
    ...Object.fromEntries(TAG_GROUP_ORDER.map((groupName) => [groupName, new Set()]))
};

// 검색을 시작하기 전 details의 접힘/펼침 상태를 임시 저장합니다.
// 검색어를 지운 뒤 사용자가 보던 상태를 복원하기 위한 값입니다.
let filterOpenStateBeforeSearch = null;
let previousSearchQuery = "";

// 설정에 등록된 선택지와 DB에만 존재하는 값을 합쳐 자동완성 후보를 준비합니다.
const GUIDE_CHARACTER_OPTIONS = [...new Set([
    ...Object.values(CHARACTER_GROUPS).flat(),
    ...guides.map((guide) => guide.character?.trim()).filter(Boolean)
])];
// 기본 설정과 실제 공략에서 쓰인 태그를 합쳐 필터 후보를 준비합니다.
const GUIDE_TAG_OPTIONS = [...new Set([
    ...TAG_GROUP_ORDER.flatMap((groupName) => TAG_GROUPS[groupName].tags),
    ...guides.flatMap((guide) => guide.tags ?? [])
])].filter(Boolean);
