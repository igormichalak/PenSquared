window.isPenSquaredActive = false;
window.penSquaredImageUrl = null;

if ('cleanupPenSquared' in window) {
    window.cleanupPenSquared();
}

document.querySelector('#pen-squared-root')?.remove();

