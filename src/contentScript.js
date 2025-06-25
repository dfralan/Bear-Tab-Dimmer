let localOpacity = 0.3;
let localColor = '#000000';
let isExtensionEnabledGlobally = true;

chrome.storage.local.get('isExtensionEnabled', (data) => {
    isExtensionEnabledGlobally = data.isExtensionEnabled !== false;
    chrome.storage.local.get([document.location.href], (result) => {
        const tabData = result[document.location.href] || {};
        localOpacity = (tabData.opacity >= 0 && tabData.opacity <= 1) ? tabData.opacity : 0.3;
        localColor = tabData.color || '#000000';
        firstOverlay(localOpacity, localColor, isExtensionEnabledGlobally);
    });
});

function firstOverlay(opacity, color, isEnabled) {
    const alreadyDimmer = document.getElementById('dimmerOverlay');
    const visibility = isEnabled === true ? 'visible' : 'hidden';
    if (alreadyDimmer) {
        alreadyDimmer.style.opacity = opacity;
        alreadyDimmer.style.backgroundColor = color;
        alreadyDimmer.style.visibility = visibility;
    } else {
        const overlay = document.createElement('div');
        overlay.id = 'dimmerOverlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = color;
        overlay.style.opacity = opacity;
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '2344992399292922452';
        overlay.style.visibility = visibility;

        document.body.appendChild(overlay);
    }
}
