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
}

function unmount() {
    window.isPenSquaredActive = false;
}

