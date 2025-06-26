let localOpacity = 0.3;
let localColor = '#000000';
let isExtensionEnabledGlobally = true;
let isExtensionEnabledLocally = true;

const storageKey = location.origin; // <-- Usamos solo el origen del sitio (como en popup)

chrome.storage.local.get('isExtensionEnabled', (data) => {
  isExtensionEnabledGlobally = data.isExtensionEnabled !== false;

  chrome.storage.local.get([storageKey], (result) => {
    const tabData = result[storageKey] || {};

    localOpacity = (tabData.opacity >= 0 && tabData.opacity <= 1) ? tabData.opacity : 0.3;
    localColor = tabData.color || '#000000';
    isExtensionEnabledLocally = tabData.isEnabled !== false; // Si no está definido, se asume true

    console.log('Content script loaded with settings:', {
      opacity: localOpacity,
      color: localColor,
        isExtensionEnabledGlobally,
        isExtensionEnabledLocally
    });

        createOverlay(localOpacity, localColor, isExtensionEnabledLocally, isExtensionEnabledGlobally)
        
  });
});

function createOverlay(opacity, color, isExtensionEnabledLocally, isExtensionEnabledGlobally) {
    const alreadyDimmer = document.getElementById('dimmerOverlay');
    const visibility = (isExtensionEnabledLocally === true && isExtensionEnabledGlobally === true) ? 'visible' : 'hidden';

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
