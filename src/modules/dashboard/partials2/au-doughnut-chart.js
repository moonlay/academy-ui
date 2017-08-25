import Chart from 'chart.js/dist/Chart.min';
import $ from 'jquery';

export class AuDoughnutChart {
    configChart = {};
    activate(model) {
        if (model) this.configChart = model;
    }

    attached() {
        if (this.configChart) {
            // get canvas tag 
            var total = "";
            var title = "";      
            total = this.configChart.total;
            title = "Total "+ this.configChart.title;
            var ctx = document.getElementById("chart-area").getContext("2d");
            // create text inside doughnut chart
            Chart.pluginService.register({
                beforeDraw: function (chart) {
                    var width = chart.chart.width,
                        height = chart.chart.height,
                        ctx = chart.chart.ctx;
                    ctx.restore();

                    // inner text (Total)
                    var fontSize = (height / 65).toFixed(2);
                    ctx.font = fontSize + "em sans-serif";
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = '#2c3e50';
                    var text = total,
                        textX = Math.round((width - ctx.measureText(text).width) / 2),
                        textY = height / 2.25;
                    ctx.fillText(text, textX, textY);
                    // Inner text Title
                    fontSize = (height / 150).toFixed(2);
                    ctx.font = fontSize + "em sans-serif";
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = '#7f8c8d';
                    text = title,
                    textX = Math.round((width - ctx.measureText(text).width) / 2),
                    textY = height / 1.70;
                    ctx.fillText(text, textX, textY);
                    
                    ctx.save();
                }
            });
            // configuration for doughnut chart
            var config = {

                type: 'doughnut',
                data: {
                    labels: this.configChart.labels,
                    datasets: [
                        {
                            // color for chart
                            backgroundColor: this.configChart.backgroundColor,

                            // data for chart
                            data: this.configChart.data,
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    // 
                    cutoutPercentage: 75,
                    // default legend
                    legend: false,
                    // Custom Legend
                    legendCallback: function (chart) {
                        var text = [];
                        text.push('<ul class="nav nav-pills nav-stacked">');
                        for (var i = 0; i < chart.data.datasets[0].data.length; i++) {
                            text.push('<li><a><i class="fa fa-dot-circle-o"  style="color:' + chart.data.datasets[0].backgroundColor[i] + '"></i> ');
                            if (chart.data.labels[i]) {
                                text.push(' '+chart.data.labels[i]+' <span class="pull-right text-muted">'+chart.data.datasets[0].data[i]+'</span>');
                            }
                            text.push('</a></li>');
                        }
                        text.push('</ul>');
                        return text.join("");
                    },
                    // Display set False
                    title: {
                        display: false,
                        text: this.configChart.title
                    },

                    tooltips: {
                        display: true
                    },
                }
            };


            var doughnutChart = new Chart(ctx, config);

            // generate custom legend in html
            $('#legend').prepend(doughnutChart.generateLegend());
        }
    }

}