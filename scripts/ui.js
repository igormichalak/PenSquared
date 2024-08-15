(function () {
    /** @type {HTMLDivElement} */
    const rootEl = document.querySelector('#pen-squared-root');

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'x';
    rootEl.appendChild(closeBtn);

    closeBtn.addEventListener('click', async () => {
        await chrome.runtime.sendMessage({ penSquaredAction: 'unmount' });
    });
})();
