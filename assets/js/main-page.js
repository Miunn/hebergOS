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

// Text appearing
const observer = new IntersectionObserver((entries, observer) => {
    console.log(entries);
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('opacity-1');
        } else {
            e.target.classList.remove('opacity-1');
        }
    });
}, {
    rootMargin: "0px 0px -15% 0px",
    threshold: 1
});

document.querySelectorAll('main>div.wrapper section.main-text')
    .forEach(e => {
        console.log(e);
        observer.observe(e)
    });

// Anim
(async () => {
    let iteration = toDisplayChars.length

    for (let i = 0; i < iteration; i++) {
        let arrayIndex = Math.floor(Math.random() * toDisplayChars.length);
        let chosenChar = toDisplayChars[arrayIndex];
        art.textContent = replaceAt(art.textContent, chosenChar[1], chosenChar[0]);
        toDisplayChars.splice(arrayIndex, 1);
    }
})();