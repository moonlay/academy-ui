import Chart from 'chart.js/dist/Chart.bundle';

export class ContohChart {
    attached() {
        this.getChart();
    }

    getChart() {
        var ctx = document.getElementById("chart-area").getContext("2d");
        console.log("ctx");
        console.log(ctx);
        var config = {
            type: 'pie',
            data: {
                datasets: [{
                    data: [
                        10,
                        20,
                        30
                    ],

                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(255, 205, 86)',
                        'rgb(54, 162, 235)'
                    ],
                }],

                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: [
                    'Red',
                    'Yellow',
                    'Blue'
                ]
            },
            options: {
                responsive: true
            }
        };
        var data = new Chart(ctx, config);
        console.log("data");
        console.log(data);

    }
}