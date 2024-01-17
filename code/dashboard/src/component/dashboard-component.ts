import { html, render } from "lit-html"
import Chart from 'chart.js/auto';
import { DashboardModel, Sensor, store } from "../model"
import { filter, map } from "rxjs"
import { styles } from "../styles/styles"
import { mqttConfig } from "../mqtt"



import "./connection-icon"
import { unitOfSensorName } from "../model/dashboard-model"
import { LineChartComponent } from "./linechart-component";
import { SvgComponent } from "./svg-component";
import { ReportComponent } from "./report-component";

import defaultCallbacks from "chart.js/dist/plugins/plugin.tooltip";
import { produce } from "immer";


interface BoxViewModel {
  name: string
  sensors: Sensor[]
}

interface AppComponentViewModel {
  boxes: BoxViewModel[],
  selectedFloor: string
}

class DashboardComponent extends HTMLElement {
  private noActiveBoxesDisplayed: boolean;
  constructor() {
    super()
    this.attachShadow({ mode: "open" })
    this.noActiveBoxesDisplayed = false; // Flag to track whether the message has been displayed
  }

  connectedCallback() {
    store
      .pipe(
        filter(dashboard => !!dashboard),
        filter(model => !!model.boxes),
        map(toViewModel)
      )
      .subscribe(vm => this.render(vm))
  }

  setFloorName(floorName: string) {
    const nextState = produce(store.getValue(), model => {
      model.selectedFloor = floorName
    })
    store.next(nextState)
  }

  render(vm: AppComponentViewModel) {
    const hasActiveBoxes = vm.boxes.some(box => box.name.toUpperCase().startsWith(vm.selectedFloor));

    if (hasActiveBoxes) {
      this.noActiveBoxesDisplayed = false;
      render(template(vm), this.shadowRoot);
    } else if (!this.noActiveBoxesDisplayed) {
      this.noActiveBoxesDisplayed = true;
      render(html`<h1 style="color: white; text-align: center; padding: 2vw">No active boxes found...</h1>`, this.shadowRoot);
    }
  }
}


customElements.define("dashboard-component", DashboardComponent)

function toViewModel(model: DashboardModel) {
  const vm: AppComponentViewModel = {
    boxes: [],
    selectedFloor: model.selectedFloor
  }
  model.boxes.forEach((box, name) => {
    const boxModel: BoxViewModel = {
      name,
      sensors: []
    }
    box.sensors.forEach((sensor, sensorName) => {
      boxModel.sensors.push(sensor)
    })
    boxModel.sensors.sort((l, r) => l.name.toLowerCase().localeCompare(r.name.toLowerCase()))
    vm.boxes.push(boxModel)
  })
  vm.boxes.sort((l, r) => l.name.toLowerCase().localeCompare(r.name.toLowerCase()))
  return vm
}


function boxTemplate(box: BoxViewModel) {
  var splitMqttName = box.name.split("/");

  const rows = box.sensors.map((sensor) => {

    function getRSSIDescription(value) {
      if (value >= -50) return "Good";
      if (value >= -70) return "Normal";
      else return "Bad";
    }

    function getNoiseDescription(value) {
      if (value <= 320) return "Quiet";
      if (value <= 440) return "Moderate";
      if (value <= 560) return "Busy";
      if (value <= 680) return "Loud";
      else return "Very loud";
    }

    function getPressureDescription(value) {
      if (value > 1020) return "High";
      if (value < 980)  return "Low";
      else return "Normal";
    }

    function getHumidityDescription(value) {
      if (value < 30) return "Dry";
      if (value > 60) return "Humid";
      else return "Comfortable Humid";
    }

    function getLuminosityDescription(value) {
      if (value > 10000) return "Very High";
      if (value > 5000) return "High";
      if (value > 1000) return "Normal";
      if (value > 500) return "Low";
      else return "Very Low";
    }

    function getCO2Description(value) {
      if (value < 600) return "Good";
      if (value > 1500)  return "Poor";
      else return "Normal";
    }

    if (sensor.name === "rssi") {
      const rssiDescription = getRSSIDescription(sensor.value);
      return html`
          <tr>
              <td>RSSI</td>
              <td class="w3-right">${sensor.value} | ${rssiDescription} WIFI signal</td>
          </tr>
      `;
    }
    if (sensor.name === "noise") {
      const noiseDescription = getNoiseDescription(sensor.value);
      const sensorName = sensor.name;

      return html`
      <tr>
        <td>Noise</td>
        <td class="w3-right">
          ${sensor.value} | ${noiseDescription}
        </td>
      </tr>
    `;
    }

    if (sensor.name === "co2") {
      const co2Description = getCO2Description(sensor.value);
      return html`
        <tr>
          <td>CO2</td>
          <td class="w3-right">
            ${sensor.value} | ${co2Description} CO2 Level
          </td>
        </tr>
      `;
    }
  

    if (sensor.name === "humidity") {
      const humidityDescription = getHumidityDescription(sensor.value);
      return html`
        <tr>
          <td>Humidity</td>
          <td class="w3-right">
            ${sensor.value} | ${humidityDescription}
            <!-- Add a chart element here if needed -->
          </td>
        </tr>
      `;
    }

    if (sensor.name === "luminosity") {
      const luminosityDescription = getLuminosityDescription(sensor.value);
      return html`
        <tr>
          <td>Luminosity</td>
          <td class="w3-right">
            ${sensor.value} | ${luminosityDescription} Air
          </td>
        </tr>
      `;
    }

    if (sensor.name === "pressure") {
      const pressureDescription = getPressureDescription(sensor.value);
      return html`
        <tr>
          <td>Pressure</td>
          <td class="w3-right">
            ${sensor.value} | ${pressureDescription} air Pressure
          </td>
        </tr>
      `;
    }

    function getColorSquare(valueString) {
      if (sensor.name !== "neopixel") return "";
      const digitArray = Array.from(valueString, (digit) => +digit * 255);
      const colorStyle = `rgb(${digitArray[0]}, ${digitArray[1]}, ${digitArray[2]})`;

      if (colorStyle === 'rgb(255, 0, 0)') {
        return html`
        <a>The air is low quality, you have to open the window!</a>
        <span style="font-size: xxx-large; color: ${colorStyle};">&#9632;</span>`

      } else if (colorStyle === 'rgb(0, 0, 255)') {
        return html`
        <a>The air is medium quality, time to open the Window soon!</a>
        <span style="font-size: xxx-large; color: ${colorStyle};">&#9632;</span>`
      } else {
        return html`
        <a>The air is fresh!</a>
        <span style="font-size: xxx-large; color: ${colorStyle};">&#9632;</span>`
      }


    }

    const unit = unitOfSensorName[sensor.name];
    const colorSquare = getColorSquare(sensor.value.toString());

    if (sensor.name === "temperature") {
      const sensorName = sensor.name
      const chartElement = document.createElement('line-chart-component') as LineChartComponent;
      chartElement.setAttribute('sensor-name', sensorName);
      // Pass the data as an attribute
      chartElement.setAttribute('sensor-value', sensor.value.toFixed(2));

      return html`
      <tr>
        <td>Temperature</td>
        <td class="w3-right">
          ${Number(sensor.value.toFixed(2))} ${unit}
          ${chartElement}
        </td>
      </tr>`;
    }

    return html`
        <tr>
        <td>${sensor.name.charAt(0).toUpperCase() + sensor.name.slice(1)}</td>
          <td class="w3-right">
            ${colorSquare ? "" : `${sensor.value}`}
            ${unit}
            ${colorSquare}
          </td>
        </tr>`;
  });

  return html`
      <div class="w3-container w3-sans-serif">
          <div class="w3-panel">
              <div class="room">
                  <table class="w3-table-all box-table">
                      <caption style="color: white; background-color: #f57c00; text-align: left; border-radius: 1rem 1rem 0 0;">
                          <p style="margin: 4% 4% 2% 5%; font-size: x-large">Floor: ${splitMqttName[0].toUpperCase()}</p>
                          <hr style="width: 91%; margin: 0 auto">
                          <p style="margin: 4% 4% 4% 5%; font-size: larger">Room: ${splitMqttName[1].toUpperCase()}</p>
                      </caption>
                      <thead>
                      <tr>
                          <th>Name</th>
                          <th class="w3-right">Value</th>
                      </tr>
                      </thead>
                      <tbody>${rows}</tbody>
                  </table>
              </div>
          </div>
      </div>
  `;
}


function template(vm: AppComponentViewModel) {
  const boxes = vm.boxes.map(boxTemplate)

  const svgElement = document.createElement('svg-component') as SvgComponent;
  const reportElement = document.createElement('report-component') as ReportComponent;

  return html`
      ${styles}
      <style>
          @keyframes fadeIn {
              from {
                  opacity: 0;
              }
              to {
                  opacity: 1;
              }
          }

          .box-container {
              display: flex;
              align-items: flex-start;
              justify-content: center;
              flex-wrap: wrap;
              animation: fadeIn 0.5s forwards;
          }

          .spring {
              flex-grow: 1;
          }

          .box-table {
              margin: auto;
              width: auto;
              border: none;
          }

          table {
              table-layout: auto;
          }

          tbody tr:nth-child(even) td {
              background-color: #f1f1f1;
          }

          tbody tr:nth-child(odd) td {
              background-color: #fff;
          }

          tbody tr:last-child {
              overflow: hidden;
              border: none;
              background-color: rgba(255, 0, 0, 0) !important;
          }

          tbody tr:last-child td:first-child {
              border-bottom-left-radius: 1rem;
          }

          tbody tr:last-child td:last-child {
              border-bottom-right-radius: 1rem;
          }

          th, td {
              width: auto;
          }

          tbody > tr:hover {
              color: #f57c00;
          }

          .room {
              box-shadow: 10px 10px 5px #000000;
          }

          report-component {
              font-family: "Open Sans", Arial, sans-serif;
              font-size: larger;
              color: white;
          }
      </style>

      <!--${svgElement}-->

      <div class="w3-container">
          <h3 class="w3-panel w3-center" style="color: rgb(255,255,255)"><span class="w3-monospace">
        <mqtt-connected-icon></mqtt-connected-icon>
        ${mqttConfig.topic}</span> ws://${mqttConfig.host}:${mqttConfig.port}
          </h3>
      </div>
      <section>
          <div class="box-container">
              ${boxes}
          </div>
      </section>
      <!--${reportElement}-->
  `
}

// Abbildung eines SVGs
/*async function fetchSvg() {
  const response = await fetch("../../resources/svg/first-floor.svg");
  const svgText = await response.text();
  return svgText;
}

async function renderSvg() {
  const svgContent = await fetchSvg();

  const svgDocument = new DOMParser().parseFromString(svgContent, "image/svg+xml");
  const svgElement = svgDocument.documentElement;

  svgElement.setAttribute("width", "700");
  svgElement.setAttribute("height", "700");

  render(html`${svgElement}`, document.body);
}

renderSvg();*/
