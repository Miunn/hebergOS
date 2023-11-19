import {fireBasicSwal, fireConfirmationSwal, fireInputSwal} from "../script";
import Swal from "sweetalert2";

const deleteContainerBtn = document.getElementById("delete-container");
const changeMemory = document.getElementById("config-memory");
const changeCpu = document.getElementById("config-cpu");

deleteContainerBtn.addEventListener("click", (event) => {
    event.preventDefault();

    let element = event.currentTarget;
    fireConfirmationSwal('Êtes-sûr de vouloir supprimer ce container ?', 'Supprimer', 'warning', async (r) => {
        if (!r.isConfirmed) {
            return;
        }

        const response = await fetch(element.getAttribute("data-delete"));
        console.log(response);
        console.log(response.ok);

        if (response.ok) {
            const json = await response.json();
            if (json["status"] === "success") {
                fireBasicSwal("Container supprimé", "success", (r) => {location.href=element.getAttribute('data-redirect')});
            } else {
                fireBasicSwal("Impossible de supprimer le container", "error", ()=>{}, "Vérfiez que le container est éteint");
            }
        } else {
            fireBasicSwal("Impossible de joindre l'application", "error");
        }
    });
});

changeMemory.addEventListener("click", (event) => {
    event.preventDefault();

    let element = event.currentTarget;
    fireInputSwal(
        'Nouvelle limite mémoire',
        'text',
        true,
        async (value) => {
            if (isNaN(Number(value))) {
                Swal.showValidationMessage('Entrez une valeur valide');
                return;
            }

            const response = await fetch(element.dataset.configMemory+`?value=${value}`);

            if (response.ok) {
                const json = await response.json();
                if (json["status"] === "success") {
                    fireBasicSwal("Changement effectué", "success", (r) => {location.reload()});
                } else {
                    fireBasicSwal("Impossible d'effectuer le changement", "error");
                }
            } else {
                fireBasicSwal("Impossible de joindre l'application", "error");
            }
        });
});

changeCpu.addEventListener("click", (event) => {
    event.preventDefault();

    let element = event.currentTarget;
    fireInputSwal(
        'Nouvelle limite cpu',
        'text',
        true,
        async (value) => {
            if (isNaN(Number(value))) {
                Swal.showValidationMessage('Entrez une valeur valide');
                return;
            }

            const response = await fetch(element.dataset.configCpu+`?value=${value}`);

            if (response.ok) {
                const json = await response.json();
                if (json["status"] === "success") {
                    fireBasicSwal("Changement effectué", "success", (r) => {location.reload()});
                } else {
                    fireBasicSwal("Impossible d'effectuer le changement", "error");
                }
            } else {
                fireBasicSwal("Impossible de joindre l'application", "error");
            }
        });
});