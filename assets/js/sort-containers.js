function sortByName(containers, reverse=false) {
    if (reverse) {
        return containers.sort((a,b) => {
            let aName = a.querySelector('.name').innerText;
            let bName = b.querySelector('.name').innerText;
            return -(aName.localeCompare(bName));
        });
    } else {
        return containers.sort((a,b) => {
            let aName = a.querySelector('.name').innerText;
            let bName = b.querySelector('.name').innerText;
            return aName.localeCompare(bName);
        });
    }
}

function sortByState(containers, reverse=false) {
    let order = ['Running', 'Paused', 'Restarting', 'Exited', 'Created', 'Removing', 'Dead'];
    if (reverse) {
        return containers.sort((a, b) => {
            let aState = a.querySelector('.state').innerText.trim();
            let bState = b.querySelector('.state').innerText.trim();

            return order.indexOf(bState) - order.indexOf(aState);
        });
    } else {
        return containers.sort((a, b) => {
            let aState = a.querySelector('.state').innerText.trim();
            let bState = b.querySelector('.state').innerText.trim();

            return order.indexOf(aState) - order.indexOf(bState);
        });
    }
}

const sortName = document.getElementById('sort-name');
const sortState = document.getElementById('sort-state');

const containersParent = document.getElementById(sortName.dataset.wrapper);
const containers = Array.from(containersParent.children);

sortName.addEventListener('click', (e) => {
    e.preventDefault();

    let performReverse = e.currentTarget.dataset.reverse === "true";
    e.currentTarget.setAttribute('data-reverse', performReverse === false);
    let sorted = sortByName(containers, performReverse);

    while (containersParent.firstChild) {
        containersParent.removeChild(containersParent.lastChild);
    }

    for (let container of sorted) {
        containersParent.appendChild(container);
    }
});

sortState.addEventListener('click', (e) => {
    e.preventDefault();

    console.log('sort state');
    let performReverse = e.currentTarget.dataset.reverse === "true";
    e.currentTarget.setAttribute('data-reverse', performReverse === false);
    let sorted = sortByState(containers, performReverse);
    console.log(sorted)

    while (containersParent.firstChild) {
        containersParent.removeChild(containersParent.lastChild);
    }

    for (let container of sorted) {
        containersParent.appendChild(container);
    }
});