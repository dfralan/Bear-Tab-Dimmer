/**
 * Crea o actualiza un div de superposición en la página.
 * @param {number} opacity - El nivel de opacidad (0.0 a 1.0).
 * @param {string} color - El color de fondo en formato CSS (ej. 'black', '#FF0000').
 * @param {boolean} isEnabled - Indica si la superposición está habilitada o no.
 */

// --- Estado de la Aplicación ---
let selectedColor = 'black';
let selectedOpacity = 0.3;
let isExtensionEnabled = false;

let presets = [];

// Presets que se cargarán por defecto la primera vez que se use la extensión.
const defaultPresets = [
    { id: 'preset-1', opacidad: 27, color: "#000000" },
    { id: 'preset-2', opacidad: 7, color: "#888888" },
    { id: 'preset-3', opacidad: 20, color: "#FFEFDB" },
    { id: 'preset-4', opacidad: 15, color: "#FFF59D" },
    { id: 'preset-5', opacidad: 25, color: "#000033" },
    { id: 'preset-6', opacidad: 22, color: "#8A2BE2" },
    { id: 'preset-7', opacidad: 17, color: "#483D8B" },
    { id: 'preset-8', opacidad: 14, color: "#4B0082" },
    { id: 'preset-9', opacidad: 16, color: "#B0C4DE" },
    { id: 'preset-10', opacidad: 19, color: "#191970" }
];

// Generar un id único
function generarIdUnico() {
    return 'preset-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// =================================================================
// NUEVA FUNCIÓN DE RENDERIZADO
// =================================================================
/**
 * Lee el array `presets` y genera el HTML para cada círculo en el contenedor.
 */
function renderPresets() {
    const container = document.getElementById("presetsContainer");
    let prevFiltersAmount = container.children.length;
    container.innerHTML = ""; // Limpiamos el contenedor para redibujar todo

    presets.forEach(preset => {
        const div = document.createElement("div");
        div.id = preset.id;
        if (presets.length > prevFiltersAmount) {
            div.className = "filter-circle relative" + (preset === presets[0] ? " pop-in" : " pop-push");
        } else {
            div.className = "filter-circle relative pop-pull";
        }

        
        div.style.backgroundColor = preset.color;
        div.setAttribute("data-opacity", preset.opacidad);
        div.setAttribute("data-color", preset.color);

        div.innerHTML = `
      <small class="percentage-text">${preset.opacidad}%</small>
      <button data-id="${preset.id}" style="width: 10px; height: 10px;" class="removePresetButton absolute bg-tint rounded-full right-0 top-0 p-xxs">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="white">
          <path d="m336-280-56-56 144-144-144-143 56-56 144 144 143-144 56 56-144 143 144 144-56 56-143-144-144 144Z"/>
        </svg>
      </button>
    `;
        container.appendChild(div);
    });
}

function guardarPresetsEnStorage() {
    chrome.storage.local.set({ presets: presets }, () => {
        console.log("Presets guardados en el storage.");
    });
}

function agregarNuevoPreset() {
    const newId = generarIdUnico();
    presets.unshift({
        id: newId,
        opacidad: Math.round(selectedOpacity * 100),
        color: selectedColor
    });
    renderPresets(); // Redibujamos la lista
    guardarPresetsEnStorage(); // Guardamos el nuevo estado en el storage
}

function eliminarPresetPorId(id) {
    const index = presets.findIndex((preset) => preset.id.toString() === id);
    if (index !== -1) {
        presets.splice(index, 1);
        renderPresets(); // Redibujamos la lista
        guardarPresetsEnStorage(); // Guardamos el nuevo estado en el storage
    }
}

document.getElementById('createPreset').addEventListener('click', agregarNuevoPreset);


function createOverlay(opacity, color, isEnabled) {
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

document.addEventListener('DOMContentLoaded', function() {
    // --- Referencias a Elementos del DOM ---
    const globalToggle = document.getElementById('globalToggle');
    const mainControls = document.getElementById('mainControls');
    const slider = document.getElementById('opacitySlider');
    const opacityValue = document.getElementById('opacityValue');
    const bearOverlay = document.getElementById("bearOverlay");
    const colorButton = document.getElementById('colorPreview');
    const colorPopup = document.getElementById('colorPopup');
    const colorBox = document.getElementById('colorBox');
    const hueSlider = document.getElementById('hueSlider');
    const svSelector = document.getElementById('svSelector');
    const hueIndicator = document.getElementById('hueIndicator');

    let hue = 0, sat = 1, val = 1;
    let activeTab = null;
    let storageKey = null; // --> Variable para la clave de almacenamiento basada en el dominio.

    // =================================================================
    // INICIALIZACIÓN
    // =================================================================

    // ¡Paso clave! Renderizamos los presets desde el array al iniciar.
    renderPresets();

    chrome.storage.local.get(['presets', 'isExtensionEnabled'], (data) => {
        if (data.presets !== undefined) {
            presets = data.presets;
        } else {
            presets = defaultPresets;
        }

        renderPresets();


        isExtensionEnabled = data.isExtensionEnabled !== false; // default a true
        globalToggle.checked = isExtensionEnabled;
        updateControlsState();

        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            activeTab = tabs[0];
            if (!activeTab || activeTab.url.startsWith('chrome://')) {
                mainControls.remove();
                document.getElementById('tabNotCompatible').classList.remove('hidden');
                return;
            }

            try {
                storageKey = new URL(activeTab.url).origin;
            } catch (e) {
                // Si la URL no es válida (ej. páginas internas), no hacemos nada.
                 mainControls.remove();
                 document.getElementById('tabNotCompatible').classList.remove('hidden');
                 return;
            }

            chrome.storage.local.get([storageKey], (result) => {
                const tabData = result[storageKey] || {};
                selectedOpacity = tabData.opacity !== undefined ? tabData.opacity : 0.3;
                selectedColor = tabData.color !== undefined ? tabData.color : 'black';
                setupEventListeners();
                updateUIFromState();
                applyOverlayToPage();
            });
        });
    });

    // =================================================================
    // LÓGICA PRINCIPAL
    // =================================================================

    function updateControlsState() {
        if (isExtensionEnabled) {
            mainControls.classList.remove('disabled');
            mainControls.classList.remove('grayscale');
        } else {
            mainControls.classList.add('disabled');
            mainControls.classList.add('grayscale');
        }
    }

    function saveAndApplySettings() {
        if (!activeTab || !isExtensionEnabled || !storageKey) return;
        
        const currentTabData = {
            opacity: selectedOpacity,
            color: selectedColor
        };

        chrome.storage.local.set({ [storageKey]: currentTabData });
        applyOverlayToPage();
    }

    function applyOverlayToPage() {
        if (!activeTab) return; // Añadida pequeña guarda de seguridad
        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            func: createOverlay,
            args: [selectedOpacity, selectedColor, isExtensionEnabled]
        });
    }

    function setupEventListeners() {
        globalToggle.addEventListener('change', function() {
            isExtensionEnabled = this.checked;
            chrome.storage.local.set({ isExtensionEnabled: isExtensionEnabled });
            updateControlsState();
            applyOverlayToPage();
        });

        slider.addEventListener('input', function() {
            selectedOpacity = slider.value / 100;
            opacityValue.textContent = slider.value + '%';
            bearOverlay.style.opacity = selectedOpacity;
            saveAndApplySettings();
        });

        colorButton.addEventListener('click', () => {
            const rect = colorButton.getBoundingClientRect();
            colorPopup.style.left = `${rect.left}px`;
            colorPopup.style.top = `${rect.bottom + 5}px`;
            colorPopup.style.display = colorPopup.style.display === "none" ? "block" : "none";
        });

        document.addEventListener('click', (e) => {
            if (!colorPopup.contains(e.target) && e.target !== colorButton) {
                colorPopup.style.display = 'none';
            }
        });

        colorBox.addEventListener('mousedown', e => {
            e.preventDefault();
            function move(ev) {
                updateSV(ev.clientX, ev.clientY);
                updateColorUI();
            }
            function up() {
                window.removeEventListener('mousemove', move);
                window.removeEventListener('mouseup', up);
                saveAndApplySettings();
            }
            move(e);
            window.addEventListener('mousemove', move);
            window.addEventListener('mouseup', up);
        });

        hueSlider.addEventListener('mousedown', e => {
            e.preventDefault();
            function move(ev) {
                updateHue(ev.clientX);
                updateColorUI();
            }
            function up() {
                window.removeEventListener('mousemove', move);
                window.removeEventListener('mouseup', up);
                saveAndApplySettings();
            }
            move(e);
            window.addEventListener('mousemove', move);
            window.addEventListener('mouseup', up);
        });
    }

    // =================================================================
    // FUNCIONES DE AYUDA (UI y Color)
    // =================================================================

    function updateUIFromState() {
        slider.value = selectedOpacity * 100;
        opacityValue.textContent = `${Math.round(selectedOpacity * 100)}%`;
        bearOverlay.style.opacity = selectedOpacity;
        colorButton.style.backgroundColor = selectedColor;
    }

    function updateColorUI() {
        const hex = hsvToHex(hue, sat, val);
        selectedColor = hex;
        colorButton.style.backgroundColor = hex;
    }

    function updateSV(x, y) {
        const rect = colorBox.getBoundingClientRect();
        sat = Math.min(1, Math.max(0, (x - rect.left) / rect.width));
        val = 1 - Math.min(1, Math.max(0, (y - rect.top) / rect.height));
        svSelector.style.left = `${sat * 100}%`;
        svSelector.style.top = `${(1 - val) * 100}%`;
    }

    function updateHue(x) {
        const rect = hueSlider.getBoundingClientRect();
        hue = Math.min(1, Math.max(0, (x - rect.left) / rect.width));
        hueIndicator.style.left = `${hue * 100}%`;
        colorBox.style.backgroundColor = hsvToHex(hue, 1, 1);
    }

    function hsvToHex(h, s, v) {
        let r, g, b;
        let i = Math.floor(h * 6);
        let f = h * 6 - i;
        let p = v * (1 - s);
        let q = v * (1 - f * s);
        let t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }
        return "#" + [r, g, b].map(x =>
            Math.round(x * 255).toString(16).padStart(2, "0")
        ).join("");
    }

    // =================================================================
// LISTENER ÚNICO PARA EL CONTENEDOR DE PRESETS (DELEGACIÓN DE EVENTOS)
// =================================================================
document.getElementById("presetsContainer").addEventListener("click", (event) => {
    // 1. Chequeamos si se hizo click en un botón de eliminar
    const removeButton = event.target.closest(".removePresetButton");
    if (removeButton) {
        const id = removeButton.getAttribute("data-id");
        eliminarPresetPorId(id);
        return; // Detenemos la ejecución para no activar el click del círculo
    }

    // 2. Chequeamos si se hizo click en un círculo
    const circle = event.target.closest(".filter-circle");
    if (circle) {
        selectedOpacity = circle.getAttribute('data-opacity') / 100;
        selectedColor = circle.getAttribute('data-color');
        updateUIFromState();
        saveAndApplySettings();
    }
});
const presetsContainer = document.getElementById("presetsContainer")

  presetsContainer.addEventListener("scroll", function () {
    if (presetsContainer.scrollLeft === 0) {
      this.classList.add("rightFeatherMask");
      this.classList.remove("leftFeatherMask");
    } else {
      this.classList.remove("rightFeatherMask");
      this.classList.add("leftFeatherMask");
    }
  });

  presetsContainer.addEventListener('wheel', function(event) {
  if (event.deltaY !== 0) {
    this.scrollLeft += event.deltaY; // Mueve la barra de desplazamiento horizontal
    event.preventDefault(); // Prevenir el desplazamiento vertical
  }
});
});