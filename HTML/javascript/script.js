// 검색어에 맞춰 필터와 공략 목록을 다시 그립니다.
TAG_SEARCH_INPUT.addEventListener("input", renderFilters);
GUIDE_TITLE_SEARCH_INPUT.addEventListener("input", renderGuides);

restoreFilterPreferences();
for (const group of Object.values(FILTER_GROUPS)) {
    group.container.addEventListener("toggle", () => {
        // 검색 결과를 보여주기 위해 자동으로 펼친 상태는 사용자 설정으로 저장하지 않습니다.
        if (!getSearchQuery()) {
            saveFilterPreferences();
        }
    });
}

// 테마 설정을 반영하고 다음 방문에도 선택을 유지합니다.
function updateThemeToggleButton() {
    const isDarkMode = document.documentElement.dataset.theme === "dark";
    THEME_TOGGLE_BUTTON.textContent = isDarkMode ? "라이트모드" : "다크모드";
    THEME_TOGGLE_BUTTON.setAttribute("aria-pressed", String(isDarkMode));
}

updateThemeToggleButton();
THEME_TOGGLE_BUTTON.addEventListener("click", () => {
    const isDarkMode = document.documentElement.dataset.theme !== "dark";
    document.documentElement.dataset.theme = isDarkMode ? "dark" : "light";
    updateThemeToggleButton();
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
});

// 플랫폼을 바꾸면 해당 플랫폼에 맞는 공략 ID를 설정합니다.
GUIDE_PLATFORM_INPUT.addEventListener("change", () => {
    updateGuideIdForPlatform();
});
// 페이지를 처음 열었을 때도 선택된 플랫폼에 맞게 ID를 초기화합니다.
updateGuideIdForPlatform();

// 캐릭터와 태그 입력란에 추천 검색어 목록을 연결합니다.
setupAutocomplete(
    GUIDE_CHARACTER_INPUT,
    document.querySelector("#guide-character-suggestions"),
    GUIDE_CHARACTER_OPTIONS
);
GUIDE_TAG_INPUTS.forEach((input, index) => {
    setupAutocomplete(
        input,
        document.querySelector(`#guide-tag-${index + 1}-suggestions`),
        GUIDE_TAG_OPTIONS
    );
});
setupGuideFormValidation();

// 공략 추가 창을 열고 닫습니다.
OPEN_SQL_GENERATOR_BUTTON.addEventListener("click", () => {
    SQL_GENERATOR_DIALOG.showModal();
});
CLOSE_SQL_GENERATOR_BUTTON.addEventListener("click", () => {
    SQL_GENERATOR_DIALOG.close();
});
SQL_GENERATOR_DIALOG.addEventListener("click", (event) => {
    if (event.target === SQL_GENERATOR_DIALOG) {
        SQL_GENERATOR_DIALOG.close();
    }
});

// 입력한 공략 정보를 INSERT SQL 문으로 만들어 화면에 표시합니다.
// 브라우저에서 Python이나 DB를 직접 실행하는 것은 아니므로, 생성된 SQL을 DB에 반영하려면 별도 절차가 필요합니다.
GUIDE_FORM.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateGuideForm()) {
        GUIDE_FORM.reportValidity();
        return;
    }

    SQL_OUTPUT.value = createGuideInsertSql();
    SQL_OUTPUT_AREA.hidden = false;
    SQL_STATUS.textContent = "crud.sql에 붙여 넣을 INSERT 문이 생성되었습니다.";
});

// 생성된 SQL을 클립보드에 복사합니다.
COPY_SQL_BUTTON.addEventListener("click", copyGeneratedSql);

// 화면 상단으로 이동합니다. 사용자가 줄인 동작을 선호하면 애니메이션을 생략합니다.
BACK_TO_TOP_BUTTON.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth"
    });
});

// 페이지를 처음 열 때 필터와 공략 목록을 표시합니다.
renderFilters();
renderGuides();
