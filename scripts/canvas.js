(function() {
    class PressurePath2D {
        constructor() {
            this.segments = [];
        }
        moveTo(x, y) {
            this.segments.push({ func: 'moveTo', x, y });
        }
        lineTo(x, y, pressure) {
            if (!pressure) {
                const lineSegments = this.segments.filter(seg => seg.func === 'lineTo');
                pressure = lineSegments.length > 0 ? lineSegments.at(-1).pressure : 0;
            }

            this.segments.push({ func: 'lineTo', x, y, pressure });
        }
    }

    const ppaths = [];

    /** @type {HTMLCanvasElement} */
    const canvas = document.querySelector('#pen-squared-root canvas');

    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const img = new Image();

    const drawImage = () => {
        const canvasAR = canvas.width / canvas.height;
        const imageAR = img.width / img.height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasAR > imageAR) {
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
    };

    let needsRedraw = false;

    const redraw = () => {
        if (!needsRedraw) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!img.complete) {
            return;
        }

        drawImage();

        let strokeColor;

        if ('penSquaredColor' in window) {
            strokeColor = window.penSquaredColor;
        } else {
            strokeColor = 'rgb(0 0 0)';
        }

        ctx.strokeStyle = strokeColor;

        for (const ppath of ppaths) {
            ctx.beginPath();
            for (const seg of ppath.segments) {
                if (seg.func === 'moveTo') {
                    ctx.moveTo(seg.x, seg.y);
                }
                if (seg.func === 'lineTo') {
                    ctx.lineWidth = 6 * seg.pressure;
                    ctx.lineTo(seg.x, seg.y);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(seg.x, seg.y);
                }
            }
        }

        needsRedraw = false;
    };

    const requestRedraw = () => {
        if (needsRedraw) return;
        needsRedraw = true;
        requestAnimationFrame(redraw);
    };

    img.onload = requestRedraw;
    img.src = window.penSquaredImageUrl;

    document.addEventListener('focus', requestRedraw);
    document.addEventListener('blur', requestRedraw);
    document.addEventListener('visibilitychange', requestRedraw);

    const onresize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        requestRedraw();
    };
    onresize();

    window.addEventListener('resize', onresize);

    window.cleanupPenSquared = () => {
        document.removeEventListener('focus', requestRedraw);
        document.removeEventListener('blur', requestRedraw);
        document.removeEventListener('visibilitychange', requestRedraw);

        window.removeEventListener('resize', onresize);

        delete window.cleanupPenSquared;
    };

    let isDrawing = false;

    canvas.addEventListener('pointerleave', () => {
        isDrawing = false;
    });

    canvas.addEventListener('pointerup', e => {
        if (!isDrawing) return;

        ppaths.at(-1).lineTo(e.offsetX, e.offsetY);

        isDrawing = false;
        requestRedraw();
    });

    canvas.addEventListener('pointerdown', e => {
        isDrawing = true;

        const path = new PressurePath2D();
        path.moveTo(e.offsetX, e.offsetY);
        ppaths.push(path);
    });

    canvas.addEventListener('pointermove', e => {
        if (!isDrawing) return;

        ppaths.at(-1).lineTo(e.offsetX, e.offsetY, e.pressure);

        requestRedraw();
    });
})();
