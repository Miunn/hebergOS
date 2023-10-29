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

const sortName = document.getElementById('sort-name');
const sortState = document.getElementById('sort-state');

const containersParent = document.getElementById(sortName.dataset.wrapper);
const containers = containersParent.children;
console.log(containers);

sortName.addEventListener('click', (e) => {
    e.preventDefault();

    let performReverse = e.currentTarget.dataset.reverse === "true";
    e.currentTarget.setAttribute('data-reverse', performReverse === false);
    let sorted = sortByName(Array.from(containers), performReverse);

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
});