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
const opacityObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('opacity-1');
        } else {
            e.target.classList.remove('opacity-1');
        }
    });
}, {
    rootMargin: "0px 0px -16% 0px",
    threshold: 1
});

const contactUs = document.querySelector('#contact-us');

const stickyObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            contactUs.classList.add('in-place');
        } else {
            contactUs.classList.remove('in-place');
        }
    })
});

document.querySelectorAll('main>div.wrapper section.main-text')
    .forEach(e => {
        opacityObserver.observe(e)
    });

const stickyDetector = document.querySelector('.sticky-detector');
stickyObserver.observe(stickyDetector);

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