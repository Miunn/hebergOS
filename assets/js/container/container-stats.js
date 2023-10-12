import {Chart} from 'chart.js/auto';
//import 'chartjs-adapter-moment';
import 'chartjs-adapter-date-fns';

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

    let milliTS = timestamp;
    //timestamps.push(new Date(milliTS).toLocaleTimeString());
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

/*
1h  10 sec
4h  10 sec
1j  2mins
7j  30mins
all
 */

console.log(ramData)
createChart(ramChart, timestamps, [{
    label: 'RAM',
    data: ramData,
    fill: true,
    borderWidth: 5
}], {
    scales: {
        x: {
            type: 'time',
            time: {
                unit: 'millisecond'
            }
        },
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
        x: {
            type: 'time',
            time: {
                unit: 'second'
            }
        },
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
        x: {
            type: 'time',
            time: {
                unit: 'second'
            }
        },
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
        x: {
            type: 'time',
            time: {
                unit: 'second'
            }
        },
        y: {
            suggestedMax: 1000,
            beginAtZero: true
        }
    },
});