
let main = document.getElementById('main');

function addStatistic(title, performance, dates) {
    let container = document.createElement('div');
    container.setAttribute('class', 'main__statistic-block statistic-block');

    let titleElement = document.createElement('h3');
    titleElement.setAttribute('class', 'statistic-block__title');
    titleElement.innerText = title;
    container.appendChild(titleElement);

    let canvas = document.createElement('canvas');
    container.appendChild(canvas);
    createChart(canvas, dates, performance);

    main.appendChild(container);
}

function createChart(canvas, dates, values) {
    let colors = [];
    const greenColor = '#7EB77F';
    const redColor = '#E84855';

    values.forEach(value => {
        if (value > 0) {
            colors.push(greenColor);
        } else {
            colors.push(redColor);
        }
    });

    let chart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Growth rate in percents',
                    data: values,
                    backgroundColor: colors
                }
            ]
        }
    });
    return chart;
}

function loadStatistic() {
    let baseURL = 'http://localhost:8080';
    let fetchURL = `${baseURL}/statistic`;
    fetch(fetchURL).then(response => {
        response.json().then(json => {
            let strategiesMap = {};
            json.forEach(entry => {
                console.log(entry);
                if (strategiesMap[entry.strategyName] == undefined) {
                    strategiesMap[entry.strategyName] = {};
                }
                let strategyObject = strategiesMap[entry.strategyName];
                let date = entry.date.substring(0,10);
                strategyObject[date] = entry.percentPerformance;
            });
            console.log(strategiesMap);
            let keys = Object.keys(strategiesMap);
            keys.forEach(key => {
                let performance = Object.values(strategiesMap[key]);
                let dates = Object.keys(strategiesMap[key]);
                addStatistic(key,performance,dates);
            });
        });
    });
}


loadStatistic();