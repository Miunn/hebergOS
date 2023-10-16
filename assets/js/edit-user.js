import '../styles/edit-user.scss';

const addContainerFormDeleteLink = (item) => {
    const removeFormButton = document.createElement('button');
    removeFormButton.innerHTML = "<img class='icon-little' src='/build/images/remove.png' alt='Remove'>";

    item.append(removeFormButton);

    removeFormButton.addEventListener('click', (e) => {
        e.preventDefault();
        // remove the li for the tag form
        item.remove();
    });
}

const addFormToCollection = (e) => {
    const collectionHolder = document.querySelector('.' + e.currentTarget.dataset.collectionHolderClass);

    const item = document.createElement('div');

    item.innerHTML = collectionHolder
        .dataset
        .prototype
        .replace(
            /__name__/g,
            collectionHolder.dataset.index
        );

    collectionHolder.appendChild(item);

    collectionHolder.dataset.index++;

    addContainerFormDeleteLink(item);
};

document
    .querySelectorAll('.add_item_link')
    .forEach(btn => {
        btn.addEventListener("click", addFormToCollection)
    });

// Add delete button
document
    .querySelectorAll('#user_form_containers div')
    .forEach((container) => {
        addContainerFormDeleteLink(container)
    })