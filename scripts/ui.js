(function () {
    /** @type {HTMLDivElement} */
    const rootEl = document.querySelector('#pen-squared-root');

    const panel = document.createElement('div');
    panel.id = 'p2-panel';

    const closeButton = document.createElement('button');
    closeButton.classList.add('p2-panel-btn');

    const closeIcon = document.createElement('span');
    const closeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 -960 960 960" fill="#5f6368"><path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z"/></svg>`;
    closeIcon.style.backgroundImage = `url('data:image/svg+xml;base64,${btoa(closeSvg)}')`
    closeButton.appendChild(closeIcon);

    closeButton.addEventListener('click', async () => {
        await chrome.runtime.sendMessage({ penSquaredAction: 'unmount' });
    });

    panel.appendChild(closeButton);

    const undoButton = document.createElement('button');
    undoButton.classList.add('p2-panel-btn');

    const undoIcon = document.createElement('span');
    const undoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 -960 960 960" fill="#5f6368"><path d="M320-200q-17 0-28.5-11.5T280-240q0-17 11.5-28.5T320-280h244q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l76 76q11 11 11 28t-11 28q-11 11-28 11t-28-11L188-572q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l144-144q11-11 28-11t28 11q11 11 11 28t-11 28l-76 76h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H320Z"/></svg>`;
    undoIcon.style.backgroundImage = `url('data:image/svg+xml;base64,${btoa(undoSvg)}')`;
    undoButton.appendChild(undoIcon);

    undoButton.addEventListener('click', () => {
        if ('penSquaredUndo' in window) window.penSquaredUndo();
    });

    panel.appendChild(undoButton);
    panel.appendChild(document.createElement('hr'));

    const colors = {
        'black': '#000000',
        'white': '#FFFFFF',
        'red': '#FF3B30',
        'orange': '#FF9500',
        'green': '#34C759',
        'blue': '#007AFF',
    };
    window.penSquaredColor = colors['black'];

    const colorsContainer = document.createElement('div');
    colorsContainer.id = 'p2-panel-colors'

    for (const cname in colors) {
        const cvalue = colors[cname];

        const button = document.createElement('button');
        button.ariaLabel = `Pick ${cname} color`;

        button.style.backgroundColor = cvalue;
        button.style.border = `1px solid oklab(from ${cvalue} calc(l - 0.15) a b)`;

        button.style.transform = window.penSquaredColor === cvalue ? 'scale(0.6)' : 'scale(1)';

        button.addEventListener('click', () => {
            window.penSquaredColor = cvalue;

            for (const otherButton of colorsContainer.children) {
                otherButton.style.transform = 'scale(1)';
            }
            button.style.transform = 'scale(0.6)';
        });

        colorsContainer.appendChild(button);
    }

    panel.appendChild(colorsContainer);
    rootEl.appendChild(panel);
})();
