// 하나의 태그가 속한 그룹 이름을 반환합니다.
// 알 수 없는 값은 other로 분류해 렌더링이 중단되지 않게 합니다.
function getTagGroup(tag) {
    return Object.entries(TAG_GROUPS)
        .find(([, group]) => group.tags.includes(tag))?.[0] ?? "other";
}

// DB 입력 순서와 관계없이 결과 태그를 화면 표시 순서로 정렬합니다.
function getSortedTags(tags) {
    return TAG_GROUP_ORDER.flatMap((groupName) =>
        tags.filter((tag) => getTagGroup(tag) === groupName)
    );
}

// 현재 필터 그룹에서 화면에 보여줄 선택지 목록을 계산합니다.
// 기본 옵션과 실제 데이터에 포함된 동적 옵션을 합쳐 중복을 제거합니다.
function getOptions(groupName, baseOptions, subfilter) {
    const valueField = subfilter?.characterGroup ? "character" : groupName;
    const guideValues = guides.flatMap((guide) => {
        const value = guide[valueField];
        return Array.isArray(value) ? value : value ? [value] : [];
    });
    const matchingGuideValues = subfilter?.characterGroup
        ? guideValues.filter((character) =>
            CHARACTER_GROUP_BY_NAME.get(character) === subfilter.characterGroup
        )
        : guideValues;

    return [...new Set([...baseOptions, ...matchingGuideValues])];
}

// 검색창의 공백을 제거하고 대소문자 영향을 줄인 검색어를 반환합니다.
function getSearchQuery() {
    return TAG_SEARCH_INPUT.value.trim().toLocaleLowerCase();
}

// 한글 완성형 문자를 초성으로 변환합니다.
// 예를 들어 '대처법'은 'ㄷㅊㅂ'으로 변환되어 초성 검색에 사용됩니다.
function getKoreanInitials(value) {
    const INITIAL_CONSONANTS = [
        "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ",
        "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"
    ];

    return [...value].map((character) => {
        const code = character.charCodeAt(0) - 0xac00;
        if (code < 0 || code > 11171) return character;
        return INITIAL_CONSONANTS[Math.floor(code / 588)];
    }).join("");
}

// 필터 선택 상태를 추가하거나 제거한 뒤 관련 화면을 다시 렌더링합니다.
function updateSelectedFilter(selection, option, checked) {
    if (checked) {
        selection.add(option);
    } else {
        selection.delete(option);
    }

    // 선택 후 검색어를 비워 다른 필터 선택지를 다시 표시합니다.
    TAG_SEARCH_INPUT.value = "";
    renderFilters();
    renderGuides();
}

// 하나의 상위 필터 그룹을 렌더링하고, 선택지가 없는 하위 그룹은 숨깁니다.
function renderFilterGroup(groupName) {
    const group = FILTER_GROUPS[groupName];
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
        const isSelected = SELECTED_FILTERS[filterName].has(option);

        button.type = "button";
        button.className = `filter-option filter-option-${filterName}`;
        button.textContent = option;
        button.setAttribute("aria-pressed", String(isSelected));
        button.addEventListener("click", () => {
            updateSelectedFilter(
                SELECTED_FILTERS[filterName],
                option,
                !SELECTED_FILTERS[filterName].has(option)
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
            Object.entries(FILTER_GROUPS).map(([groupName, group]) => [
                groupName,
                group.container.open
            ])
        );
    }

    // 검색 중에는 일치하는 하위 그룹을 바로 볼 수 있도록 필터를 펼칩니다.
    if (hasSearchQuery) {
        for (const group of Object.values(FILTER_GROUPS)) {
            group.container.open = true;
        }
    } else if (previousSearchQuery !== "" && filterOpenStateBeforeSearch) {
        for (const [groupName, wasOpen] of Object.entries(filterOpenStateBeforeSearch)) {
            FILTER_GROUPS[groupName].container.open = wasOpen;
        }
        filterOpenStateBeforeSearch = null;
    }

    for (const groupName of Object.keys(FILTER_GROUPS)) {
        renderFilterGroup(groupName);
    }

    previousSearchQuery = searchQuery;
}

// 선택된 필터를 기준으로 공략을 걸러내고 결과 카드를 출력합니다.
