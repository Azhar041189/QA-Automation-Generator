// Background service worker for the Chrome extension
chrome.runtime.onInstalled.addListener(() => {
    console.log('QA Test Recorder extension installed');
});

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getRecorderState') {
        // Return current recorder state if needed
        sendResponse({ status: 'ready' });
    }
    return true; // Keep message channel open for async response
});