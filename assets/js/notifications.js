import '../styles/notifications.scss';
import {fireBasicSwal, fireConfirmationSwal} from "./script";

Array.from(document.getElementsByClassName("delete-notification")).forEach((btn) => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();

        let element = e.currentTarget;
        fireConfirmationSwal(
            "Supprimer la demande ?",
            'Supprimer',
            'question',
            async (r) => {
                if (!r.isConfirmed) {
                    return
                }

                const response = await fetch(element.getAttribute('data-route'));

                if (response.ok) {
                    fireBasicSwal(
                        'Notification supprimée',
                        'success',
                        () => {
                            location.reload();
                        }
                    );
                } else {
                    fireBasicSwal(
                        'Impossible de supprimer la notification',
                        'error'
                    );
                }
            });
    });
});