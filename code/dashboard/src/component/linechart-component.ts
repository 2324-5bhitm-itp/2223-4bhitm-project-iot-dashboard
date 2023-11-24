import Chart from 'chart.js/auto'
import { filter, map } from "rxjs"
import { DashboardModel, Sensor, store } from "../model"
import _ from "lodash"

interface BoxViewModel {
  name: string
  sensors: Sensor[]
}

interface AppComponentViewModel {
  boxes: BoxViewModel[]
}

export class LineChartComponent extends HTMLElement {
  private chart: Chart;
  private sensorName: string;

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.createChart();
    this.subscribeToSensorUpdates();
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
            fill: true,
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
    this.sensorName = this.getAttribute('sensor-name');
  }

  subscribeToSensorUpdates() {
    // Subscribe to sensor updates using RxJS
    store
      .pipe(
        filter(dashboard => !!dashboard),
        filter(model => !!model.boxes),
        map(toViewModel),
        map(vm => vm.boxes.find(box => box.name === this.sensorName)),
        filter(box => !!box),
        map(box => box.sensors.find(sensor => sensor.name === 'temperature')),
        filter(sensor => !!sensor),
      )
      .subscribe(sensor => this.updateChartData(sensor.lastValueReceivedAt, sensor.value));
  }


  static get observedAttributes() {
    return ['sensor-name'];
  }

  attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (attrName === 'sensor-name' && oldVal !== newVal) {
      this.sensorName = newVal;

      // Update the chart when the sensor name changes
      //this.updateChartData([], []);
    }
  }
  updateChartData(labels: number, data: number) {
    if (this.chart) {
      this.chart.data.labels.push(labels);
      this.chart.data.datasets[0].data.push(data);
      this.chart.update();
    }
  }
}

function toViewModel(model: DashboardModel) {
  const vm: AppComponentViewModel = {
    boxes: []
  }
  model.boxes.forEach((box, name) => {
    const boxModel: BoxViewModel = {
      name,
      sensors: []
    }
    box.sensors.forEach((sensor, sensorName) => {
      boxModel.sensors.push(_.clone(sensor))
    })
    boxModel.sensors.sort((l, r) => l.name.toLowerCase().localeCompare(r.name.toLowerCase()))
    vm.boxes.push(boxModel)
  })
  vm.boxes.sort((l, r) => l.name.toLowerCase().localeCompare(r.name.toLowerCase()))
  return vm
}

function cleanDate(d) {
  return new Date(+d.replace(/\/Date\((\d+)\)\//, '$1')).toDateString()
}



customElements.define('line-chart-component', LineChartComponent);
