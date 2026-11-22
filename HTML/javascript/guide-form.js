// 선택한 플랫폼에 배정된 ID 구간에서 아직 사용하지 않은 가장 작은 번호를 찾습니다.
function getNextAvailableGuideId(platform) {
    const platformConfig = PLATFORM_ID_CONFIG.get(platform);
    if (!platformConfig) {
        return null;
    }

    const rangeStart = platformConfig.idPrefix;
    const rangeSize = platformConfig.idRangeSize;
    const usedIds = new Set(
        guides.map((guide) => Number(guide.id)).filter((id) => Number.isInteger(id))
    );

    for (let id = rangeStart; id < rangeStart + rangeSize; id++) {
        if (!usedIds.has(id)) {
            return id;
        }
    }

    return null;
}

// 플랫폼이 바뀌면 다음 ID를 입력하고, 빈 번호가 없으면 폼 검증 오류로 알립니다.
function updateGuideIdForPlatform() {
    const nextId = getNextAvailableGuideId(GUIDE_PLATFORM_INPUT.value);

    if (nextId === null) {
        GUIDE_ID_INPUT.value = "";
        GUIDE_ID_INPUT.setCustomValidity("선택한 플랫폼의 ID 구간에 빈 번호가 없습니다.");
        GUIDE_ID_HELP.textContent = "이 플랫폼의 ID 구간에 빈 번호가 없습니다.";
        return;
    }

    GUIDE_ID_INPUT.value = String(nextId);
    GUIDE_ID_INPUT.setCustomValidity("");
    GUIDE_ID_HELP.textContent = "플랫폼을 선택하면 로드된 DB 데이터 기준 최소 빈 ID를 입력합니다.";
}

// 공백만 입력하거나 필터 설정에 없는 값을 폼 검증 오류로 표시합니다.
function validateGuideForm() {
    let isValid = true;
    const fields = [
        { input: GUIDE_TITLE_INPUT, label: "제목", required: true },
        {
            input: GUIDE_CHARACTER_INPUT,
            label: "캐릭터",
            options: GUIDE_CHARACTER_OPTION_SET
        },
        ...GUIDE_TAG_INPUTS.map((input, index) => ({
            input,
            label: `태그 ${index + 1}`,
            required: index === 0,
            options: GUIDE_TAG_OPTION_SET
        }))
    ];

    for (const { input, label, required = false, options } of fields) {
        const value = input.value.trim();
        let error = "";

        if (!value) {
            if (input.value.length > 0) {
                error = `${label}: 공백만 입력할 수 없습니다.`;
            } else if (required) {
                error = `필수 입력 항목입니다: ${label}.`;
            }
        } else if (options && !options.has(value)) {
            error = `${label}: 필터 설정에 등록된 값만 입력할 수 있습니다.`;
        }

        input.setCustomValidity(error);
        isValid = isValid && error === "";
    }

    return isValid;
}

function setupGuideFormValidation() {
    const inputs = [
        GUIDE_TITLE_INPUT,
        GUIDE_CHARACTER_INPUT,
        ...GUIDE_TAG_INPUTS
    ];

    for (const input of inputs) {
        input.addEventListener("input", validateGuideForm);
    }
    validateGuideForm();
}

// 입력한 검색어를 포함하는 추천 항목을 최대 8개까지 목록에 표시합니다.
function renderAutocompleteSuggestions(input, list, options) {
    const query = input.value.trim().toLocaleLowerCase();
    const matchingOptions = query
        ? options.filter((option) => {
            const normalizedOption = option.toLocaleLowerCase();
            return normalizedOption.includes(query) && normalizedOption !== query;
        }).slice(0, 8)
        : [];

    list.replaceChildren();
    list.hidden = matchingOptions.length === 0;
    input.setAttribute("aria-expanded", String(!list.hidden));

    // 추천 항목을 누르면 입력값으로 선택하고, input 이벤트를 발생시켜 관련 UI도 갱신합니다.
    for (const option of matchingOptions) {
        const item = document.createElement("li");
        const button = document.createElement("button");

        button.type = "button";
        button.className = "guide-autocomplete-option";
        button.textContent = option;
        button.addEventListener("mousedown", (event) => event.preventDefault());
        button.addEventListener("click", () => {
            input.value = option;
            input.dispatchEvent(new Event("input", { bubbles: true }));
            input.focus();
        });

        item.append(button);
        list.append(item);
    }
}

// 입력 중에는 추천 목록을 갱신하고, 입력란과 목록 모두에서 벗어나면 목록을 닫습니다.
function setupAutocomplete(input, list, options) {
    const hideIfUnfocused = () => {
        window.setTimeout(() => {
            if (document.activeElement !== input && !list.contains(document.activeElement)) {
                list.hidden = true;
                input.setAttribute("aria-expanded", "false");
            }
        }, 0);
    };

    input.addEventListener("input", () =>
        renderAutocompleteSuggestions(input, list, options)
    );
    input.addEventListener("blur", hideIfUnfocused);
    list.addEventListener("focusout", hideIfUnfocused);
}

// SQL 문자열 값 안의 작은따옴표를 SQLite 표기 방식에 맞게 두 번 써서 처리합니다.
function escapeSqlValue(value) {
    return value.replaceAll("'", "''");
}

// 폼 값을 읽어 guides 테이블에 한 행을 추가하는 INSERT 문을 만듭니다.
function createGuideInsertSql() {
    const VALUES = [
        document.querySelector("#guide-id-input").value.trim(),
        document.querySelector("#guide-url-input").value.trim(),
        document.querySelector("#guide-title-input").value.trim(),
        document.querySelector("#guide-character-input").value.trim(),
        document.querySelector("#guide-platform-input").value,
        ...[1, 2, 3, 4, 5].map((index) =>
            document.querySelector(`#guide-tag-${index}-input`).value.trim()
        )
    ];
    // ID는 숫자이므로 따옴표 없이 쓰고, 나머지 값은 SQL 문자열로 감쌉니다.
    const SQL_VALUES = VALUES.map((value, index) =>
        index === 0 ? value : `'${escapeSqlValue(value)}'`
    );

    return `INSERT INTO guides (id, url, title, chara, platform, tag1, tag2, tag3, tag4, tag5) VALUES
`
        + `	(${SQL_VALUES.join(", ")});`;
}

// 생성된 SQL을 복사합니다. 클립보드 접근이 막히면 사용자가 직접 복사하도록 SQL을 선택합니다.
async function copyGeneratedSql() {
    try {
        await navigator.clipboard.writeText(SQL_OUTPUT.value);
        SQL_STATUS.textContent = "SQL을 클립보드에 복사했습니다.";
    } catch (error) {
        console.error(error);
        SQL_OUTPUT.select();
        SQL_STATUS.textContent = "자동 복사에 실패했습니다. 선택된 SQL을 직접 복사하세요.";
    }
}
