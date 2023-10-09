import '../styles/users.scss';
import {fireBasicSwal, fireConfirmationSwal} from "./script";
import Swal from "sweetalert2";

const deleteUserBtn = document.getElementsByClassName("delete-user");
Array.from(deleteUserBtn).forEach((btn) => {
    btn.addEventListener("click", (event) => {
        event.preventDefault();

        fireConfirmationSwal(
            "Supprimer l'utilisateur ?",
            "Supprimer",
            'question',
            (result) => {
                /* Read more about isConfirmed, isDenied below */
                if (!result.isConfirmed) {
                    return;
                }

                fetch(event.target.getAttribute('href'))
                    .then(r => {
                        if (r.ok) {
                            fireBasicSwal('Utilisateur supprimé', 'success', () => location.reload());
                        } else {
                            fireBasicSwal('Echec de la suppression', 'error');
                        }
                    })
            })
    });
});