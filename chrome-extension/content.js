let steps = []

function getSelector(el) {
    if (el.id) return "#" + el.id
    if (el.name) return `[name="${el.name}"]`
    return el.tagName.toLowerCase()
}

document.addEventListener("click", e => {
    const selector = getSelector(e.target)
    steps.push({
        type: "click",
        selector: selector
    })
    console.log("Recorded:", selector)
})

document.addEventListener("input", e => {
    const selector = getSelector(e.target)
    steps.push({
        type: "type",
        selector: selector,
        value: e.target.value
    })
})

// Listen for messages from popup or background
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "GET_STEPS") {
        sendResponse(steps)
    }
    // Clear steps when requested
    if (msg.type === "CLEAR_STEPS") {
        steps = []
        sendResponse({ status: "cleared" })
    }
})