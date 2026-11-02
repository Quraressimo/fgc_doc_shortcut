const tagSearchInput = document.querySelector("#tag-search-input");
const guideList = document.querySelector("#guide-list");
const searchStatus = document.querySelector("#search-status");

// 시즌별 DLC 캐릭터 목록입니다.
const seasonPassCharacters = {
    1: ["골드루이스 디킨슨", "잭 오", "해피 케이오스", "바이켄", "테스타먼트"],
    2: ["브리짓", "신 키스크", "베드맨?", "아스카 R#"],
    3: ["죠니", "엘페르트 밸런타인", "A.B.A", "슬레이어"],
    4: ["퀸 디지", "베놈", "유니카", "루시"],
    5: ["쿠라도베리 잼", "로보카이"]
};

const filterGroups = {
    character: {
        container: document.querySelector("#character-filter-category"),
        subfilters: [
            {
                key: "character",
                list: document.querySelector("#base-character-filter-list"),
                container: document.querySelector("#base-character-filter-list").closest("fieldset"),
                options: [
                    "솔 배드가이", "카이 키스크", "메이", "액슬 로우", "치프 자너프",
                    "포템킨", "파우스트", "밀리아 레이지", "자토 ONE", "램리썰 밸런타인",
                    "레오 화이트 팽", "나고리유키", "지오바나", "미토 안지", "이노"
                ],
                characterType: "base"
            },
            ...Object.entries(seasonPassCharacters).map(([seasonPass, options]) => {
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
        container: document.querySelector("#platform-filter-category"),
        list: document.querySelector("#platform-filter-list"),
        options: ["YOUTUBE", "트위터", "디스코드", "DC", "아카"]
    },
    tags: {
        container: document.querySelector("#tag-filter-category"),
        list: document.querySelector("#tag-filter-list"),
        options: [],
        subfilters: [
            {
                key: "difficulty",
                container: document.querySelector("#difficulty-filter-group"),
                list: document.querySelector("#difficulty-filter-list"),
                options: ["입문", "초급", "중급", "고급"]
            },
            {
                key: "situation",
                container: document.querySelector("#situation-filter-group"),
                list: document.querySelector("#situation-filter-list"),
                options: ["뉴트럴", "대공"]
            },
            {
                key: "location",
                container: document.querySelector("#location-filter-group"),
                list: document.querySelector("#location-filter-list"),
                options: ["개막", "구석"]
            },
            {
                key: "category",
                container: document.querySelector("#category-filter-group"),
                list: document.querySelector("#category-filter-list"),
                options: ["콤보", "셋업"]
            },
            {
                key: "type",
                container: document.querySelector("#type-filter-group"),
                list: document.querySelector("#type-filter-list"),
                options: ["콤보", "셋업"]
            }
        ]
    }
};

// 공략 데이터가 추가되면 필터 항목과 검색 결과에 함께 반영됩니다.
const guides = [];

// 체크 선택을 검색어 입력과 별도로 보존합니다.
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

function getSearchQuery() {
    return tagSearchInput.value.trim().toLocaleLowerCase();
}

function updateSelectedFilter(selection, option, checked) {
    if (checked) {
        selection.add(option);
    } else {
        selection.delete(option);
    }

    // 선택 후 검색어를 비워 숨겨졌던 다른 필터 항목도 다시 표시합니다.
    tagSearchInput.value = "";
    renderFilters();
    renderGuides();
}

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

function renderOptionList(filterName, list, presetOptions, subfilter) {
    const query = getSearchQuery();
    const options = getOptions(filterName, presetOptions, subfilter);
    const matchingOptions = options.filter((option) =>
        option.toLocaleLowerCase().includes(query)
    );

    list.replaceChildren();

    if (matchingOptions.length === 0) {
        return false;
    }

    for (const option of matchingOptions) {
        const item = document.createElement("li");
        const label = document.createElement("label");
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.value = option;
        checkbox.checked = selectedFilters[filterName].has(option);
        checkbox.addEventListener("change", () => {
            updateSelectedFilter(selectedFilters[filterName], option, checkbox.checked);
        });

        label.append(checkbox, document.createTextNode(option));
        item.append(label);
        list.append(item);
    }

    return true;
}

function renderFilters() {
    for (const groupName of Object.keys(filterGroups)) {
        renderFilterGroup(groupName);
    }
}

function renderGuides() {
    const hasSelectedFilters = Object.values(selectedFilters)
        .some((options) => options.size > 0);
    const matchingGuides = !hasSelectedFilters
        ? []
        : guides.filter((guide) =>
            // 같은 필터 안은 OR, 서로 다른 필터 종류 사이는 AND로 적용합니다.
            Object.entries(selectedFilters).every(([groupName, selectedOptions]) => {
                if (selectedOptions.size === 0) return true;

                const guideValue = guide[groupName];
                const guideOptions = Array.isArray(guideValue)
                    ? guideValue
                    : guideValue ? [guideValue] : [];

                return [...selectedOptions].some((option) =>
                    guideOptions.includes(option)
                );
            })
        );

    guideList.replaceChildren();

    for (const guide of matchingGuides) {
        const item = document.createElement("li");
        const link = document.createElement("a");

        link.href = guide.url;
        link.textContent = guide.title;
        item.append(link);
        guideList.append(item);
    }

    if (guides.length === 0) {
        searchStatus.textContent = "등록된 공략이 없습니다.";
    } else if (!hasSelectedFilters) {
        searchStatus.textContent = "필터를 선택하면 공략을 볼 수 있습니다.";
    } else if (matchingGuides.length === 0) {
        searchStatus.textContent = "선택한 태그에 해당하는 공략이 없습니다.";
    } else {
        searchStatus.textContent = `${matchingGuides.length}개의 공략을 찾았습니다.`;
    }
}

tagSearchInput.addEventListener("input", renderFilters);
renderFilters();
renderGuides();