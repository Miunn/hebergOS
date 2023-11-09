import '../styles/main-page.scss';

function replaceAt(string, index, replacement) {
    return string.substring(0, index) + replacement + string.substring(index+replacement.length);
}

const art = document.querySelector("#logo-ascii");
const finalArt = art.textContent;
let emptyArt = '';

let toDisplayChars = [];

for (let i = 0; i < finalArt.length; i++) {
    if (finalArt[i] !== ' ') {
        toDisplayChars.push([finalArt[i], i]);
    }

    if (finalArt[i] === '\n') {
        emptyArt += '\n';
    } else {
        emptyArt += ' ';
    }
}
art.textContent = emptyArt;

// Anim
let iteration = toDisplayChars.length
for (let i = 0; i < iteration; i++) {
    let arrayIndex = Math.floor(Math.random() * toDisplayChars.length);
    let chosenChar = toDisplayChars[arrayIndex];
    art.textContent = replaceAt(art.textContent, chosenChar[1], chosenChar[0]);
    toDisplayChars.splice(arrayIndex, 1);
    console.log("char chosen:", chosenChar, 'remaining chars:', toDisplayChars.length);
    await new Promise(r => setTimeout(r, 0.1));
}