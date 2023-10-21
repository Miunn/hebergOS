import {fireBasicSwal, fireConfirmationSwal} from "../script";

const deleteContainerBtn = document.getElementById("delete-container");

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