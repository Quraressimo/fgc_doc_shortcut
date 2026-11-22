// 화면 상단 이동 버튼은 접근성 설정에 따라 부드러운 이동 여부를 결정합니다.
TAG_SEARCH_INPUT.addEventListener("input", renderFilters);
GUIDE_TITLE_SEARCH_INPUT.addEventListener("input", renderGuides);
GUIDE_PLATFORM_INPUT.addEventListener("change", () => {
    updateGuideIdForPlatform();
});
updateGuideIdForPlatform();
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
GUIDE_FORM.addEventListener("submit", (event) => {
    event.preventDefault();
    SQL_OUTPUT.value = createGuideInsertSql();
    SQL_OUTPUT_AREA.hidden = false;
    SQL_STATUS.textContent = "crud.sql에 붙여 넣을 INSERT 문이 생성되었습니다.";
});
COPY_SQL_BUTTON.addEventListener("click", copyGeneratedSql);
BACK_TO_TOP_BUTTON.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth"
    });
});
renderFilters();
renderGuides();
