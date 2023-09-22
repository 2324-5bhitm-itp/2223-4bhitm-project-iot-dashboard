/*import Chart from 'chart.js/auto'

class ChartComponent extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }

    connectedCallback() {
        this.render()
        this.firstUpdated()
    }

    firstUpdated() {
        const canvas = this.shadowRoot.querySelector('#myDoughChart')
        const ctx = canvas.getContext('2d')
        let curval = 30
        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ["Current Temperature", " "],
                datasets: [{
                    label: 'Temperature',
                    data: [curval, 40 - curval],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                cutout: '70%',
            }
        })
    }

    render() {
        this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block
        }
      </style>
      <div>
        <canvas id="myDoughChart" width="400" height="400"></canvas>
      </div>
    `;
    }
}

customElements.define('doughchart-component', ChartComponent)
*/