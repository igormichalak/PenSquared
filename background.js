chrome.action.onClicked.addListener(async tab => {
    const isActive = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => 'isPenSquaredActive' in window && window.isPenSquaredActive,
    }).then(resp => resp[0].result);

    if (isActive) {
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['scripts/unmount.js'],
        });
        chrome.scripting.removeCSS({
            target: { tabId: tab.id },
            files: ['main.css'],
        });
        return;
    }

    await chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ['main.css'],
    });

    const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: 'png' });

    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: url => (window.penSquaredImageUrl = url),
        args: [dataUrl],
    });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['scripts/mount.js', 'scripts/canvas.js', 'scripts/ui.js'],
    });
});

chrome.runtime.onMessage.addListener(async (req, sender) => {
    if (req?.penSquaredAction !== 'unmount' || !sender.tab) return;

    await chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        files: ['scripts/unmount.js'],
    });
    chrome.scripting.removeCSS({
        target: { tabId: sender.tab.id },
        files: ['main.css'],
    });
});
