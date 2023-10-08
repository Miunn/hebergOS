import {Chart} from 'chart.js/auto';

function createChart(chartCanvas, labels, datasets, opts={}) {
    const options = Object.assign({}, {
        elements: {
            point: {
                radius: 0
            }
        }
    }, opts);

    console.log(options);
    new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        options: options
    });
}

const data = JSON.parse(document.getElementById("data-stats").getAttribute("data-stats"));

const ramChart = document.getElementById("ram-chart");
const cpuChart = document.getElementById("cpu-chart");
const netChart = document.getElementById("net-chart");
const netDeltaChart = document.getElementById("net-delta-chart");

console.log(ramChart);

let timestamps = [];
let ramData = [];
let cpuData = [];
let netTotalUpData = [];
let netTotalDownData = [];
let netDeltaUpData = [];
let netDeltaDownData = [];


Object.entries(data).forEach((entry) => {
    const [timestamp, stat] = entry;

    timestamps.push(timestamp);

    ramData.push(stat["memory"]["used"]);
    cpuData.push(stat["cpu"]["usage_percent"]);
    netTotalUpData.push(stat["net"]["up"]);
    netTotalDownData.push(stat["net"]["down"]);
    netDeltaUpData.push(stat["net"]["delta_up"]);
    netDeltaDownData.push(stat["net"]["delta_down"]);

});

//console.log(ramData);
console.log(cpuData);
console.log(netDeltaUpData);
console.log(netDeltaDownData);

createChart(ramChart, timestamps, [{
    label: 'RAM',
    data: ramData,
    borderWidth: 5
}]);

createChart(cpuChart, timestamps, [{
    label: 'CPU',
    data: cpuData,
    borderWidth: 5
}]);

createChart(netChart, timestamps, [
    {
        label: 'NET Up',
        data: netTotalUpData,
        borderWidth: 5
    },
    {
        label: 'NET Down',
        data: netTotalDownData,
        borderWidth: 5
    }
], {
    scales: {
        y: {
            suggestedMax: 1000,
            beginAtZero: true
        }
    },
});

createChart(netDeltaChart, timestamps, [
    {
        label: 'NET Delta Up',
        data: netDeltaUpData,
        borderWidth: 5
    },
    {
        label: 'NET Delta Down',
        data: netDeltaDownData,
        borderWidth: 5
    }
], {
    scales: {
        y: {
            suggestedMax: 1000,
            beginAtZero: true
        }
    },
});