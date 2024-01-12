import Chart from 'chart.js/auto';

export class LineChartComponent extends HTMLElement {
  private chart: Chart;

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.createChart();
  }

  createChart() {
    const canvas = document.createElement('canvas');
    this.shadowRoot?.appendChild(canvas);

    var now = new Date()
    var hours = now.getHours().toString()
    var minutes = now.getMinutes().toString()
    var seconds = now.getSeconds().toString()

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: [now.getTime(), now.getTime() + 1, now.getTime() + 2, now.getTime() + 3],
        datasets: [
          {
            label: 'Temperature',
            data: [10,15,20,25,30],
            borderColor: 'rgb(75, 192, 192)',
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'linear', // Use linear scale instead of time scale
          },
          y: {
            title: {
              display: true,
              text: 'Temperature (°C)',
            },
          },
        },
      },
    });
  }

  static get observedAttributes() {
    return ['sensor-name', 'sensor-value'];
  }
  
  attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (attrName === 'sensor-value' && oldVal !== newVal && this.chart) {
      console.log("update")
      this.updateChartData(1, Number(newVal))
      console.log(newVal)
      this.chart.update()
    }
  }

  updateChartData(labels: number, data: number) {
    if (this.chart) {
      console.log("update")
      this.chart.data.labels.push(labels)
      this.chart.data.datasets[0].data.push(data)
      console.log(data)
      this.chart.update()
    }
  }
}

// function cleanDate(d) {
//   return new Date(+d.replace(/\/Date\((\d+)\)\//, '$1')).toDateString()
// }

customElements.define('line-chart-component', LineChartComponent);
