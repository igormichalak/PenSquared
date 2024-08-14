// chrome.runtime.onInstalled.addListener(async () => {});

chrome.action.onClicked.addListener(async tab => {
    const isActive = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => 'isPenSquaredActive' in window && window.isPenSquaredActive,
    }).then(resp => resp[0].result);

    if (isActive) {
        await chrome.scripting.removeCSS({
            files: ["main.css"],
            target: { tabId: tab.id },
        });
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: unmount,
        });
        return;
    }

    await chrome.scripting.insertCSS({
        files: ["main.css"],
        target: { tabId: tab.id },
    });
    const dataUrl = await chrome.tabs.captureVisibleTab();
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: mount,
        args: [dataUrl],
    });
});

function mount(imageUrl) {
    window.isPenSquaredActive = true;

    const rootEl = document.createElement('div');
    rootEl.id = 'pen-squared-root';

    let bgColor = getComputedStyle(document.body).backgroundColor;

    if (bgColor === 'rgba(0, 0, 0, 0)') {
        bgColor = 'rgb(255 255 255)';
    }

    rootEl.style.backgroundColor = bgColor;

    const canvas = document.createElement('canvas');
    rootEl.appendChild(canvas);

    document.body.appendChild(rootEl);

    const ctx = canvas.getContext('2d');

    const img = new Image();

    const redraw = () => window.requestAnimationFrame(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!img.complete) {
            return;
        }

        const canvasAspect = canvas.width / canvas.height;
        const imageAspect = img.width / img.height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasAspect > imageAspect) {
            drawHeight = canvas.height;
            drawWidth = img.width * (drawHeight / img.height);
            offsetY = 0;
            offsetX = (canvas.width - drawWidth) / 2;
        } else {
            drawWidth = canvas.width;
            drawHeight = img.height * (drawWidth / img.width);
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    });

    img.onload = redraw;
    img.src = imageUrl;
    
    document.addEventListener('focus', redraw);
    document.addEventListener('blur', redraw);
    document.addEventListener('visibilitychange', redraw);

    canvas.addEventListener('pointerleave', redraw);
    canvas.addEventListener('pointerup', redraw);

    const onresize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        redraw();
    };
    onresize();

    window.addEventListener('resize', onresize);

    window.cleanupPenSquared = () => {
        document.removeEventListener('focus', redraw);
        document.removeEventListener('blur', redraw);
        document.removeEventListener('visibilitychange', redraw);

        window.removeEventListener('resize', onresize);

        delete window.cleanupPenSquared;
    };
}

function unmount() {
    window.isPenSquaredActive = false;

    if ('cleanupPenSquared' in window) {
        window.cleanupPenSquared();
    }

    document.querySelector('#pen-squared-root')?.remove();
}

