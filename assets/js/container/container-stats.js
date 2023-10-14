import {Chart} from 'chart.js/auto';
//import 'chartjs-adapter-moment';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(zoomPlugin);

const ramChart = document.getElementById("ram-chart");
const cpuChart = document.getElementById("cpu-chart");
const netChart = document.getElementById("net-chart");
const netDeltaChart = document.getElementById("net-delta-chart");

let ramChartReference;
let cpuChartReference;
let netChartReference;
let netDeltaChartReference;

function createChart(chartCanvas, datasets, suggestedMax, labels) {
    const options = {
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
                },
                limits: {
                    x: {
                        min: labels[0],
                        max: labels.slice(-1)
                    }
                }
            }
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'second'
                },
                min: labels[0],
                max: labels.slice(-1)
            },
            y: {
                suggestedMax: suggestedMax,
                beginAtZero: true
            }
        }
    };

    return new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        borderColor: 'rgb(75, 192, 192)',
        options: options,
    });
}

function createOffsetChart(ram, cpu, netTotalUp, netTotalDown, netDeltaUp, netDeltaDown, offset, timestamps) {
    if (ramChartReference !== undefined) {
        ramChartReference.destroy();
        cpuChartReference.destroy();
        netChartReference.destroy();
        netDeltaChartReference.destroy();
    }

    let labels = timestamps.slice(-offset);

    ramChartReference = createChart(ramChart, [{
        label: 'RAM',
        data: ram.slice(-offset),
        fill: true,
        borderWidth: 2
    }], 0.06, labels);

    cpuChartReference = createChart(cpuChart, [{
        label: 'CPU',
        data: cpu.slice(-offset),
        fill: true,
        borderWidth: 2
    }], 0, labels);

    netChartReference = createChart(netChart, [
        {
            label: 'NET Down',
            data: netTotalDown.slice(-offset),
            fill: true,
            borderWidth: 5
        },
        {
            label: 'NET Up',
            data: netTotalUpData.slice(-offset),
            fill: true,
            borderWidth: 5
        }
    ], 1000, labels);

    netDeltaChartReference = createChart(netDeltaChart, [
        {
            label: 'NET Delta Down',
            data: netDeltaDown.slice(-offset),
            fill: true,
            borderWidth: 5
        },
        {
            label: 'NET Delta Up',
            data: netDeltaUp.slice(-offset),
            fill: true,
            borderWidth: 5
        }
    ], 1000, labels);
}

const data = JSON.parse(document.getElementById("data-stats").getAttribute("data-stats"));

/** Populate data arrays **/

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

    let milliTS = parseInt(timestamp) * 1000;
    timestamps.push(milliTS);

    ramData.push({
        x: milliTS,
        y: stat["memory"]["used"]
    });
    cpuData.push({
        x: milliTS,
        y: stat["cpu"]["usage_percent"]
    });
    netTotalUpData.push({
        x: milliTS,
        y: stat["net"]["up"]
    });
    netTotalDownData.push({
        x: milliTS,
        y: stat["net"]["down"]
    });
    netDeltaUpData.push({
        x: milliTS,
        y: stat["net"]["delta_up"]
    });
    netDeltaDownData.push({
        x: milliTS,
        y: stat["net"]["delta_down"]
    });

    i++;
});

// Create default last hour chart
createOffsetChart(ramData, cpuData, netTotalUpData, netTotalDownData, netDeltaUpData, netDeltaDownData, 360, timestamps);

/** Handle period selection **/

const periodSelector = document.getElementById("charts-period");

/*
1h  10 sec
4h  10 sec
1j  2mins
7j  30mins
all
 */
periodSelector.addEventListener("change", (event) => {
    event.preventDefault();
    console.log("graph");
    switch (event.currentTarget.value) {
        case "1hour":
            createOffsetChart(ramData, cpuData, netTotalUpData, netTotalDownData, netDeltaUpData, netDeltaDownData, 360, timestamps);
            break;

        case "4hours":
            createOffsetChart(ramData, cpuData, netTotalUpData, netTotalDownData, netDeltaUpData, netDeltaDownData, 1440, timestamps);
            break;

        case "1day":
            createOffsetChart(ramData, cpuData, netTotalUpData, netTotalDownData, netDeltaUpData, netDeltaDownData, 2040, timestamps);
            break;

        case "7days":
            createOffsetChart(ramData, cpuData, netTotalUpData, netTotalDownData, netDeltaUpData, netDeltaDownData, 6360, timestamps);
            break;
    }
});