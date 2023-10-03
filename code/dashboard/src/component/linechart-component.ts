import Chart from 'chart.js/auto';

class LineChartComponent extends HTMLElement {
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

  updateChartData(labels: string[], data: number[]) {
    if (this.chart) {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = data;
      this.chart.update();
    }
  }

  static get observedAttributes() {
    return ['sensor-name'];
  }

  attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (attrName === 'sensor-name' && oldVal !== newVal) {
      // Handle sensor name change here if needed
    }
  }
}

customElements.define('line-chart-component', LineChartComponent);
