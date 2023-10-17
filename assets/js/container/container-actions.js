import {fireBasicSwal, fireConfirmationSwal} from "../script";

const startContainerCta = document.getElementById("start-container-cta");
const stopContainerCta = document.getElementById("stop-container-cta");
const restartContainerCta = document.getElementById("restart-container-cta");
const askDeleteContainerCta = document.getElementById("ask-delete-container-cta");
const askConfigContainerCta = document.getElementById("ask-config-container-cta");

startContainerCta.addEventListener("click", (event) => {
    event.preventDefault();

    let element = event.currentTarget;
    let name = element.getAttribute("data-project");

    fireConfirmationSwal(
        `Démarrer ${name} ?`,
        'Démarrer',
        'question',
        async (r) => {
            if (!r.isConfirmed) {
                return;
            }

            const response = await fetch(element.getAttribute('data-route'));

            if (response.ok) {
                // App answered but request may not have been successfully
                const json = await response.json();

                if (json['success']) {
                    fireBasicSwal(
                        `${name} démarré !`,
                        'success',
                        (r) => {
                            location.reload();
                        }
                    );
                } else {
                    fireBasicSwal(
                        `Impossible de démarrer ${name}`,
                        'error'
                    );
                }
            } else {
                fireBasicSwal(
                    "Impossible de joindre l'application",
                    'error'
                );
            }
        }
    );
});

stopContainerCta.addEventListener("click", (event) => {
    event.preventDefault();

    let element = event.currentTarget;
    let name = element.getAttribute("data-project");

    fireConfirmationSwal(
        `Arrêter ${name} ?`,
        'Arrêter',
        'question',
        async (r) => {
            if (!r.isConfirmed) {
                return;
            }

            const response = await fetch(element.getAttribute('data-route'));

            if (response.ok) {
                // App answered but request may not have been successfully
                const json = await response.json();

                if (json['success']) {
                    fireBasicSwal(
                        `${name} arrêté.`,
                        'success',
                        (r) => {
                            location.reload();
                        }
                    );
                } else {
                    fireBasicSwal(
                        `Impossible d'arrêter ${name}`,
                        'error'
                    );
                }
            } else {
                fireBasicSwal(
                    "Impossible de joindre l'application",
                    'error'
                );
            }
        }
    );
});

restartContainerCta.addEventListener("click", (event) => {
    event.preventDefault();

    let element = event.currentTarget;
    let name = element.getAttribute("data-project");

    fireConfirmationSwal(
        `Redémarrer ${name} ?`,
        'Redémarrer',
        'question',
        async (r) => {
            if (!r.isConfirmed) {
                return;
            }

            const response = await fetch(element.getAttribute('data-route'));

            if (response.ok) {
                // App answered but request may not have been successfully
                const json = await response.json();

                if (json['success']) {
                    fireBasicSwal(
                        `${name} redémarré !`,
                        'success',
                        (r) => {
                            location.reload();
                        }
                    );
                } else {
                    fireBasicSwal(
                        `Impossible de redémarrer ${name}`,
                        'error'
                    );
                }
            } else {
                fireBasicSwal(
                    "Impossible de joindre l'application",
                    'error'
                );
            }
        }
    );
});

askDeleteContainerCta.addEventListener("click", (event) => {
    event.preventDefault();

    let element = event.currentTarget;
    let name = element.getAttribute("data-project");

    fireConfirmationSwal(
        `Demander la suppression de ${name} ?`,
        'Confirmer',
        'warning',
        async (r) => {
            if (!r.isConfirmed) {
                return;
            }

            const response = await fetch(element.getAttribute("data-route"));

            if (response.ok) {
                fireBasicSwal(
                    `Demande effectuée`,
                    'success',
                    (r) => {
                        location.reload();
                    }
                );
            } else {
                fireBasicSwal(
                    `Impossible de joindre l'application`,
                    'error'
                );
            }
        })
})