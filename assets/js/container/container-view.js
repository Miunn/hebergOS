import '../../styles/container-view.scss';
import {fireBasicSwal, fireHtmlSwal} from "../script";
import Swal from "sweetalert2";

const changeDomain = document.getElementById("edit-domain");
const editDomainDialogHTML = document.getElementById("edit-domain-dialog");
const changeDomainRoute = editDomainDialogHTML.getAttribute("data-change-route");

changeDomain.addEventListener("click", (event) => {
    event.preventDefault();

    fireHtmlSwal(
        `Changer le nom de domaine de ${editDomainDialogHTML.getAttribute("data-project")}`,
        editDomainDialogHTML.innerHTML,
        null,
        true,
        async (r) => {
            let domain =  Swal.getHtmlContainer().querySelector("input[name='domain']").value;
            let data = new FormData();
            data.append('domain', domain);


            const response = await fetch(changeDomainRoute, {
                'method': 'POST',
                'body': data
            });

            if (response.ok) {
                fireBasicSwal("Changement effectué", "success", ()=>{location.reload()});
            } else {
                fireBasicSwal("Impossible d'effectuer le changement", "error");
            }
        },
    )
});