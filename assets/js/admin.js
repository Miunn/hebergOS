import '../styles/admin.scss';
import {fireBasicSwal, fireHtmlSwal} from "./script";
import Swal from "sweetalert2";

const containerCreateBtn = document.getElementById("add-container");
const containerCreateHTML = document.getElementById("dialog-container-create").innerHTML;

containerCreateBtn.addEventListener("click", (event) => {
    event.preventDefault();

    fireHtmlSwal("Créer un nouveau container", containerCreateHTML, null, true, async (r) => {
        let form = Swal.getHtmlContainer().querySelector("form#container-create-form")

        let name = form.querySelector("input[name='container_form[name]']").value;
        let memoryLimit = form.querySelector("input[name='container_form[memoryLimit]']").value;
        let cpuLimit = form.querySelector("input[name='container_form[cpuLimit]']").value;

        if (name === '') {
            Swal.showValidationMessage('Le nom est requis');
            return;
        } else if (memoryLimit === '') {
            Swal.showValidationMessage('La limite mémoire est requise');
            return;
        } else if (cpuLimit === '') {
            Swal.showValidationMessage('La limite cpu est requise');
            return;
        }

        const data = new FormData(form);
        const response = await fetch(window.location.href, {
            'method': 'POST',
            'body': data,
        });

        if (response.ok) {
            fireBasicSwal("Conteneur créé", "success", ()=>{location.reload()});
        } else {
            fireBasicSwal("Impossible de créer le container", "error");
        }
        return form;
    });
});