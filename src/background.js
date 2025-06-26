// background.js

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['contentScript.js']
    });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: function() {
            return {
                opacity : (tabData.opacity >= 0 && tabData.opacity <= 1) ? tabData.opacity : 0.3,
                color : tabData.color || '#000000',
                isEnabled: tabData.isEnabled !== false // Si no está definido, se asume true
            };
        }
    }, (results) => {
        const { opacity, color, isEnabled } = results[0].result;
        // Use the retrieved data here
        chrome.storage.local.set({ [tab.id]: { opacity, color, isEnabled } });
    });
});
