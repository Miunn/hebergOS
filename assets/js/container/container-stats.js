import {Chart} from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
Chart.register(zoomPlugin);

function createChart(chartCanvas, labels, datasets, opts={}) {
    const options = Object.assign({}, {
        elements: {
            point: {
                radius: 0.05
            }
        },
        plugins: {
            zoom: {
                pan: {
                    enabled: true,
                    mode: 'x'
                },
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true
                    },
                    mode: 'x',
                }
            }
        }
    }, opts);

    new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        options: options,
    });
}

const data = JSON.parse(document.getElementById("data-stats").getAttribute("data-stats"));

const ramChart = document.getElementById("ram-chart");
const cpuChart = document.getElementById("cpu-chart");
const netChart = document.getElementById("net-chart");
const netDeltaChart = document.getElementById("net-delta-chart");

let timestamps = [];
let ramData = [];
let cpuData = [];
let netTotalUpData = [];
let netTotalDownData = [];
let netDeltaUpData = [];
let netDeltaDownData = [];

var i = 0;
Object.entries(data).forEach((entry) => {
    const [timestamp, stat] = entry;

    timestamps.push(new Date(timestamp*1000).toLocaleTimeString());

    ramData.push(stat["memory"]["used"]);
    cpuData.push(stat["cpu"]["usage_percent"]);
    netTotalUpData.push(stat["net"]["up"]);
    netTotalDownData.push(stat["net"]["down"]);
    netDeltaUpData.push(stat["net"]["delta_up"]);
    netDeltaDownData.push(stat["net"]["delta_down"]);

    i++;
});


createChart(ramChart, timestamps, [{
    label: 'RAM',
    data: ramData,
    fill: true,
    borderWidth: 5
}], {
    scales: {
        y: {
            suggestedMax: 0.06,
            beginAtZero: true
        }
    },
});

createChart(cpuChart, timestamps, [{
    label: 'CPU',
    data: cpuData,
    fill: true,
    borderWidth: 5
}], {
    scales: {
        y: {
            beginAtZero: true
        }
    },
});

createChart(netChart, timestamps, [
    {
        label: 'NET Down',
        data: netTotalDownData,
        fill: true,
        borderWidth: 5
    },
    {
        label: 'NET Up',
        data: netTotalUpData,
        fill: true,
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
        label: 'NET Delta Down',
        data: netDeltaDownData,
        fill: true,
        borderWidth: 5
    },
    {
        label: 'NET Delta Up',
        data: netDeltaUpData,
        fill: true,
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