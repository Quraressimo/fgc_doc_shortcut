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

// SQL 문자열 안의 작은따옴표를 SQLite 문자열 표기 방식에 맞게 이스케이프합니다.
function escapeSqlValue(value) {
    return value.replaceAll("'", "''");
}

// 입력 폼의 값을 읽어 guides 테이블용 INSERT 문으로 변환합니다.
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
    const SQL_VALUES = VALUES.map((value, index) =>
        index === 0 ? value : `'${escapeSqlValue(value)}'`
    );

    return `INSERT INTO guides (id, url, title, chara, platform, tag1, tag2, tag3, tag4, tag5) VALUES
`
        + `	(${SQL_VALUES.join(", ")});`;
}

// 생성된 SQL을 클립보드에 복사하고, 브라우저 권한이 없으면 직접 선택할 수 있게 합니다.
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
