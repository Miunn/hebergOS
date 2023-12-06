import {fireBasicSwal, fireConfirmationSwal} from "../script";
import Swal from "sweetalert2";

const startContainerCta = document.getElementById("start-container-cta");
const stopContainerCta = document.getElementById("stop-container-cta");
const restartContainerCta = document.getElementById("restart-container-cta");
const askDeleteContainerCta = document.getElementById("ask-delete-container-cta");
const askConfigMemoryContainerCta = document.getElementById("ask-config-memory-container-cta");
const askConfigCpuContainerCta = document.getElementById("ask-config-cpu-container-cta");

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
        });
});

askConfigMemoryContainerCta.addEventListener("click", (event) => {
    event.preventDefault();

    const dialog = document.getElementById("notification-dialog");

    Swal.fire({
        title:`Demander un changement de la limite ram`,
        html: dialog.innerHTML,
        confirmButtonText: 'Confirmer',
        showCancelButton: true,
        cancelButtonText: 'Annuler',
        icon: 'question',
        showLoaderOnConfirm: true,
        reverseButtons: true,
        preConfirm: () => {
            const form = Swal.getHtmlContainer().querySelector('form');
            console.log(form);

            let value = form.querySelector('input[name="notification_form[value]"]').value;
            if (value === '' || isNaN(value)) {
                Swal.showValidationMessage('Une valeur est requise');
                return;
            }

            form.querySelector('input[name="notification_form[title]"]').value = "Demande de changement mémoire";
            form.querySelector('select[name="notification_form[type]"]').value = "0";

            form.submit();
        }
    });
});

askConfigCpuContainerCta.addEventListener("click", (event) => {
    event.preventDefault();

    const dialog = document.getElementById("notification-dialog");

    Swal.fire({
        title:`Demander un changement de la limite cpu`,
        html: dialog.innerHTML,
        confirmButtonText: 'Confirmer',
        showCancelButton: true,
        cancelButtonText: 'Annuler',
        icon: 'question',
        showLoaderOnConfirm: true,
        reverseButtons: true,
        preConfirm: () => {
            const form = Swal.getHtmlContainer().querySelector('form');

            let value = form.querySelector('input[name="notification_form[value]"]').value;
            if (value === '' || isNaN(value)) {
                Swal.showValidationMessage('Une valeur est requise');
                return;
            }

            form.querySelector('input[name="notification_form[title]"]').value = "Demande de changement cpu";
            form.querySelector('select[name="notification_form[type]"]').value = "1";

            form.submit();
        }
    });
});