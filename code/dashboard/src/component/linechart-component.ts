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

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Temperature',
            data: [],
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
    return ['sensor-name'];
  }

  attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (attrName === 'sensor-name' && oldVal !== newVal) {
      // Handle sensor name change here if needed
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
