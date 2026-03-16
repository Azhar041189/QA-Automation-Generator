document.getElementById("show").onclick = async () => {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    chrome.tabs.sendMessage(tab.id,
        { type: "GET_STEPS" },
        response => {
            document.getElementById("steps").textContent =
                JSON.stringify(response, null, 2);
        }
    );
};

document.getElementById("clear").onclick = async () => {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    chrome.tabs.sendMessage(tab.id,
        { type: "CLEAR_STEPS" },
        response => {
            document.getElementById("steps").textContent =
                JSON.stringify(response, null, 2);
        }
    );
};