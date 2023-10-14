import {fireBasicSwal, fireConfirmationSwal} from "../script";

const deleteContainerBtn = document.getElementById("delete-container");

deleteContainerBtn.addEventListener("click", (event) => {
    event.preventDefault();

    let element = event.currentTarget;
    console.log(element);
    fireConfirmationSwal('Êtes-sûr de vouloir supprimer ce container ?', 'Supprimer', 'warning', async (r) => {
        if (!r.isConfirmed) {
            return;
        }

        console.log("Perform delete");
        console.log(element);

        const response = await fetch(element.getAttribute("data-delete"));

        if (response.ok) {
            fireBasicSwal("Container supprimé", "success", (r) => {location.href=element.getAttribute('data-redirect')});
        } else {
            fireBasicSwal("Impossible de supprimer le container", "error")
        }
    });
});