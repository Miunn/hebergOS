import {Chart} from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';

//import 'chartjs-adapter-moment';
import 'chartjs-adapter-date-fns';
import {fr} from 'date-fns/locale';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(zoomPlugin);
Chart.register(annotationPlugin);

let root = document.querySelector(":root");
let rootStyles = getComputedStyle(root);
let chartBorderColor = rootStyles.getPropertyValue('--border-strong');
let chartBackgroundColor = rootStyles.getPropertyValue('--border-interactive')+"55";
let chartBorderColorAccent = rootStyles.getPropertyValue('--accent-border-strong');
let chartBackgroundColorAccent = rootStyles.getPropertyValue('--accent-border-interactive')+"55";

const ramChart = document.getElementById("ram-chart");
const cpuChart = document.getElementById("cpu-chart");
const netChart = document.getElementById("net-chart");
const netDeltaChart = document.getElementById("net-delta-chart");

let ramChartReference;
let cpuChartReference;
let netChartReference;
let netDeltaChartReference;

function createChart(chartCanvas, datasets, suggestedMax, labels, timeUnit, restartsOptions) {
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
                    mode: 'x',
                    speed: 0.9,
                    threshold: 2
                },
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true
                    },
                    mode: 'x',
                    speed: 0.9,
                    threshold: 2
                },
                limits: {
                    x: {
                        min: labels[0],
                        max: labels.slice(-1)
                    },
                    y: {
                        min: 0
                    }
                }
            },
            annotation: {
                annotations: restartsOptions
            }
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    /*unit: timeUnit,*/     // If not specified it will be automatically determined
                    isoWeekday: true,
                    displayFormats: {
                        'second': 'HH:mm:ss',
                        'minute': 'HH:mm',
                        'hour': 'HH:mm',
                        'day': 'EEEE dd HH:mm'
                    }
                },
                min: labels[0],
                max: labels.slice(-1),
                adapters: {
                    date: {
                        locale: fr
                    }
                }
            },
            y: {
                suggestedMax: suggestedMax,
                beginAtZero: true,
                min: 0
            },
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

function createOffsetChart(ram, cpu, netTotalUp, netTotalDown, netDeltaUp, netDeltaDown, offset, timestamps, memoryLimit, cpuLimit, timeUnit, restarts) {
    if (ramChartReference !== undefined) {
        ramChartReference.destroy();
        cpuChartReference.destroy();
        netChartReference.destroy();
        netDeltaChartReference.destroy();
    }

    let labels = timestamps.slice(-offset);

    let restartsOptions = {};
    for (let i = 0; i < restarts.length; i++) {
        restartsOptions['line'+i] = {
            type: 'line',
            xMin: (parseInt(restarts[i].timestamp) - 3600)*1000,
            xMax: (parseInt(restarts[i].timestamp) - 3600)*1000,
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 2,
        }
    }

    ramChartReference = createChart(
        ramChart,
        [
            {
                label: 'RAM (Go) - limite: '+memoryLimit+'Go',
                data: ram.slice(-offset),
                fill: true,
                borderWidth: 2,
                borderColor: chartBorderColor,
                backgroundColor: chartBackgroundColor
            },
        ],
        0.06,
        labels,
        timeUnit,
        restartsOptions
    );

    cpuChartReference = createChart(
        cpuChart,
        [{
            label: 'CPU (%) - limite: '+cpuLimit+'%',
            data: cpu.slice(-offset),
            fill: true,
            borderWidth: 2,
            borderColor: chartBorderColorAccent,
            backgroundColor: chartBackgroundColorAccent
        }],
        0,
        labels,
        timeUnit,
        restartsOptions
    );

    netChartReference = createChart(
        netChart,
        [
            {
                label: 'NET Down (ko)',
                data: netTotalDown.slice(-offset),
                fill: true,
                borderWidth: 2,
                borderColor: chartBorderColor,
                backgroundColor: chartBackgroundColor
            },
            {
                label: 'NET Up (ko)',
                data: netTotalUp.slice(-offset),
                fill: true,
                borderWidth: 2,
                borderColor: chartBorderColorAccent,
                backgroundColor: chartBackgroundColorAccent
            }
            ],
        1000,
        labels,
        timeUnit,
        restartsOptions
    );

    netDeltaChartReference = createChart(
        netDeltaChart,
        [
            {
                label: 'NET Delta Down (ko)',
                data: netDeltaDown.slice(-offset),
                fill: true,
                borderWidth: 2,
                borderColor: chartBorderColor,
                backgroundColor: chartBackgroundColor
            },
            {
                label: 'NET Delta Up (ko)',
                data: netDeltaUp.slice(-offset),
                fill: true,
                borderWidth: 2,
                borderColor: chartBorderColorAccent,
                backgroundColor: chartBackgroundColorAccent
            }
        ],
        1000,
        labels,
        timeUnit,
        restartsOptions
    );
}

const dataElement = document.getElementById("data-stats");
const statsDayUrl = dataElement.getAttribute("data-url-day");
const statsWeekUrl = dataElement.getAttribute("data-url-week");
const data = JSON.parse(dataElement.getAttribute("data-stats"));

let restarts = '';
if (dataElement.dataset.restarts) {
    restarts = JSON.parse(dataElement.dataset.restarts);
}

let memoryLimit = Object.entries(data).slice(-1)[0][1]["memory"]["limit"];
let cpuLimit = Object.entries(data).slice(-1)[0][1]["cpu"]["limit"];

/** Populate data arrays **/
function parseData(jsonData) {
    let timestamps = [];
    let ramData = [];
    let cpuData = [];
    let netTotalUpData = [];
    let netTotalDownData = [];
    let netDeltaUpData = [];
    let netDeltaDownData = [];

    let i = 0;
    Object.entries(jsonData).forEach((entry) => {
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
    return [timestamps, ramData, cpuData, netTotalUpData, netTotalDownData, netDeltaUpData, netDeltaDownData];
}

const [instantTimestamps, instantRam, instantCpu, instantNetTotalUp, instantNetTotalDown, instantNetDeltaUp, instantNetDeltaDown] = parseData(data);

// Create default last hour chart
createOffsetChart(instantRam, instantCpu, instantNetTotalUp, instantNetTotalDown, instantNetDeltaUp, instantNetDeltaDown, 240, instantTimestamps, memoryLimit, cpuLimit, 'second', restarts);

/** Handle period selection **/

const periodSelector = document.getElementById("charts-period");

/*
1h  15 sec
4h  15 sec
1j  2mins
7j  30mins
all
 */
periodSelector.addEventListener("change", (event) => {
    event.preventDefault();
    switch (event.currentTarget.value) {
        case "1hour":
            createOffsetChart(instantRam, instantCpu, instantNetTotalUp, instantNetTotalDown, instantNetDeltaUp, instantNetDeltaDown, 240, instantTimestamps, memoryLimit, cpuLimit, 'second', restarts);
            break;

        case "4hours":
            createOffsetChart(instantRam, instantCpu, instantNetTotalUp, instantNetTotalDown, instantNetDeltaUp, instantNetDeltaDown, 960, instantTimestamps, memoryLimit, cpuLimit, 'second', restarts);
            break;

        case "1day":
            (async () => {
                const response = await fetch(statsDayUrl);
                if (!response.ok) {
                    return;
                }
                const statsDay = await response.json();
                let [dayTimestamps, dayRam, dayCpu, dayNetTotalUp, dayNetTotalDown, dayNetDeltaUp, dayNetDeltaDown] = parseData(statsDay);
                createOffsetChart(dayRam, dayCpu, dayNetTotalUp, dayNetTotalDown, dayNetDeltaUp, dayNetDeltaDown, 0, dayTimestamps, memoryLimit, cpuLimit, 'minute', restarts);
            })();
            break;

        case "7days":
            (async () => {
                const response = await fetch(statsWeekUrl);
                if (!response.ok) {
                    return;
                }
                const statsWeek = await response.json();
                let [weekTimestamps, weekRam, weekCpu, weekNetTotalUp, weekNetTotalDown, weekNetDeltaUp, weekNetDeltaDown] = parseData(statsWeek);
                createOffsetChart(weekRam, weekCpu, weekNetTotalUp, weekNetTotalDown, weekNetDeltaUp, weekNetDeltaDown, 0, weekTimestamps, memoryLimit, cpuLimit, 'day', restarts);
            })();
            break;
    }
});