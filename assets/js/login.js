import '../styles/auth-form.scss';

// Computer animation
const computerAscii = `
              ,---------------------------,
              |  /---------------------\\  |
              | |                       | |
              | |                       | |
              | |                       | |
              | |                       | |
              | |                       | |
              |  \\_____________________/  |
              |___________________________|
            ,---\\_____     []     _______/------,
          /         /______________\\           /|
        /___________________________________ /  | ___
        |                                   |   |    )
        |  _ _ _                 [-------]  |   |   (
        |  o o o                 [-------]  |  /    _)_
        |__________________________________ |/     /  /
    /-------------------------------------/|      ( )/
  /-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/ /
/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/ /
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
`
const computerContainer = document.getElementById("computer");

let computerAnim = async () => {
    for (let c of computerAscii) {
        computerContainer.innerText += c;

        if (c !== " ") {
            await new Promise(r => setTimeout(r, 1));
        }
    }
};

computerAnim();

// Spotlight effect
// Map mouse position to css vars
const r = document.querySelector(':root');
document.querySelectorAll(".card-spotlight")
    .forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });