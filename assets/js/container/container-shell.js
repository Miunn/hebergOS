const shellFrame = document.getElementById("shell");
const shellWidth = document.getElementById("shell-width");
const shellHeight = document.getElementById("shell-height");

shellWidth.addEventListener("keypress", (e) => {
    if (e.key !== "Enter") {
        return;
    }
    shellFrame.setAttribute("width", e.target.value);
});

shellHeight.addEventListener("keypress", (e) => {
    if (e.key !== "Enter") {
        return;
    }
    shellFrame.setAttribute("height", e.target.value);
});