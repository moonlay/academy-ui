import { bindable, bindingMode } from 'aurelia-framework';

import Chart from 'chart.js/dist/Chart.min';
import $ from 'jquery';

export class AuDoughnutChart {

    @bindable configChart ;
    activate(model) {
        if (model) this.configChart = model;
    }

    attached() {
        if (this.configChart) {
            // get canvas tag

            var ctx = document.getElementById(this.configChart.id+"Chart").getContext("2d");
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
                    ctx.fillStyle = '#2c3e59';
                    
                    // total  
                    var total = chart.chart.config.data.datasets[0].data.reduce((a,b) => a+b, 0),
                        textX = Math.round((width - ctx.measureText(total).width) / 2),
                        textY = height / 2.30;
                    ctx.fillText(total, textX, textY);
                    // Inner text Title
                    fontSize = (height / 120).toFixed(2);
                    ctx.font = fontSize + "em corbel";
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = '#7f8c8d';

                    // description
                    var description = chart.chart.config.options.title.text,
                    textX = Math.round((width - ctx.measureText(description).width) / 2),
                    textY = height / 1.65;
                    ctx.fillText(description, textX, textY);
                    
                    ctx.save();
                }
            });

            // generate custom legend in html
            $('#'+this.configChart.id+'Legend').prepend(doughnutChart.generateLegend());
        }
    }

}