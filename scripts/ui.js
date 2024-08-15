(function () {
    /** @type {HTMLDivElement} */
    const rootEl = document.querySelector('#pen-squared-root');

    const panel = document.createElement('div');
    panel.id = 'p2-panel';

    const closeButton = document.createElement('button');
    closeButton.id = 'p2-close-btn';
    closeButton.textContent = '⨯';

    closeButton.addEventListener('click', async () => {
        await chrome.runtime.sendMessage({ penSquaredAction: 'unmount' });
    });

    panel.appendChild(closeButton);

    const undoButton = document.createElement('button');
    undoButton.id = 'p2-undo-btn';
    undoButton.textContent = '↩';

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
