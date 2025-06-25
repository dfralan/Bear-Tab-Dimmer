// background.js


console.log('background.js script loaded');

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
                selectedColor : tabData.color || '#000000',
            };
        }
    }, (results) => {
        const { opacity, selectedColor } = results[0].result;
        // Use the retrieved data here
        chrome.storage.local.set({ [tab.id]: { opacity, color: selectedColor } });
    });
});
