function renderGuides() {
    const hasSelectedFilters = Object.values(SELECTED_FILTERS)
        .some((options) => options.size > 0);
    const titleSearchQuery = GUIDE_TITLE_SEARCH_INPUT.value.trim().toLocaleLowerCase();
    const hasTitleSearch = titleSearchQuery !== "";
    // 검색어나 필터가 없을 때는 전체 공략 대신 시작 안내를 보여줍니다.
    const matchingGuides = !hasSelectedFilters && !hasTitleSearch
        ? []
        : guides.filter((guide) => {
            // 제목 검색과 필터를 함께 사용하면 두 조건을 모두 만족하는 공략만 보여줍니다.
            const matchesTitle = !hasTitleSearch
                || (guide.title ?? "").toLocaleLowerCase().includes(titleSearchQuery);
            // 각 그룹 안에서는 하나라도 일치하면 되고, 선택한 그룹들은 모두 일치해야 합니다.
            const matchesFilters = Object.entries(SELECTED_FILTERS).every(
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

    GUIDE_LIST.replaceChildren();

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
        GUIDE_LIST.append(item);
    }

    // 결과가 없는 경우, 필터 선택 여부에 따라 사용자에게 다른 안내를 표시합니다.
    if (guides.length === 0) {
        SEARCH_STATUS.textContent = "등록된 공략이 없습니다.";
    } else if (!hasSelectedFilters && !hasTitleSearch) {
        SEARCH_STATUS.textContent =
            `현재 저장된 공략은 ${guides.length}개입니다. 필터를 선택하면 공략을 확인할 수 있습니다.`;
    } else if (matchingGuides.length === 0) {
        SEARCH_STATUS.textContent = "검색 조건에 해당하는 공략이 없습니다.";
    } else {
        SEARCH_STATUS.textContent = `${matchingGuides.length}개의 공략을 찾았습니다.`;
    }
}
