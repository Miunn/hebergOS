import '../styles/admin.scss';
import {fireBasicSwal, fireHtmlSwal} from "./script";
import Swal from "sweetalert2";

const containerCreateBtn = document.getElementById("add-container");
const containerCreateHTML = document.getElementById("dialog-container-create").innerHTML;

containerCreateBtn.addEventListener("click", (event) => {
    event.preventDefault();

    fireHtmlSwal("Créer un nouveau container", containerCreateHTML, null, (r) => {
        return Swal.getHtmlContainer().querySelector("form#container-create-form");
    }, async (r) => {
        const data = new FormData(r.value);

        const response = await fetch(r.value.getAttribute("action"), {
            'method': 'POST',
            'body': data,
        });

        if (response.ok) {
            fireBasicSwal("Container créé", "success", ()=>{location.reload()});
        } else {
            fireBasicSwal("Impossible de créer le container", "error");
        }
    });
});