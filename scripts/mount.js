(function() {
    window.isPenSquaredActive = true;

    const rootEl = document.createElement('div');
    rootEl.id = 'pen-squared-root';

    let bgColor = getComputedStyle(document.body).backgroundColor;

    const isBgTransparent = bgColor === 'transparent' ||
                            bgColor === 'rgba(0, 0, 0, 0)';

    if (isBgTransparent) {
        bgColor = 'rgb(255 255 255)';
    }

    rootEl.style.backgroundColor = bgColor;

    const canvas = document.createElement('canvas');
    rootEl.appendChild(canvas);

    document.body.appendChild(rootEl);
    document.body.style.overflow = 'hidden';
})();
