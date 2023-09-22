import {html, render} from "lit-html"
import {DashboardModel, Sensor, store} from "../model"
import {filter, map} from "rxjs"
import _ from "lodash"
import {styles} from "../styles/styles"
import {mqttConfig} from "../mqtt"

import "./connection-icon"
import {unitOfSensorName} from "../model/dashboard-model"

interface BoxViewModel {
    name: string
    sensors: Sensor[]
}

interface AppComponentViewModel {
    boxes: BoxViewModel[]
}

class DashboardComponent extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({mode: "open"})

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

    render(vm: AppComponentViewModel) {
        render(template(vm), this.shadowRoot)
    }
}

customElements.define("dashboard-component", DashboardComponent)

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

function boxTemplate(box: BoxViewModel) {
    var splitMqttName = box.name.split("/");

    const rows = box.sensors
        .map(sensor => {
                // Neopixel Color Converter
                function getColorSquare(valueString) {
                    if (sensor.name !== "neopixel") return '';

                    const digitArray = Array.from(valueString, digit => +digit * 255);
                    const colorStyle = `rgb(${digitArray[0]}, ${digitArray[1]}, ${digitArray[2]})`;

                    return html`
                        <span style="font-size: xxx-large; color: ${colorStyle};">
                            &#9632;
                        </span>`;
                }

                const unit = unitOfSensorName[sensor.name];
                const colorSquare = getColorSquare(sensor.value.toString());

                return html`
                    <tr>
                        <td>${sensor.name}</td>
                        <td class="w3-right">
                            ${colorSquare ? '' : `${sensor.value}`}
                            ${unit}
                            ${colorSquare}
                        </td>
                    </tr>`;

            }
        )

    return html`
        <div class="w3-container w3-sans-serif">
            <div class="w3-panel">
                <div class="">
                    <table class="w3-table-all box-table">
                        <caption style="color: white; background-color: #f57c00; text-align: left">
                            <p style="margin: 5%">Floor: ${splitMqttName[0].toUpperCase()}</p>
                            <hr style="width: 91%; margin: 0 auto">
                            <p style="margin: 5%">Room: ${splitMqttName[1].toUpperCase()}</p>
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
        </div>
    `
}

function template(vm: AppComponentViewModel) {
    const boxes = vm.boxes.map(boxTemplate)
    return html`
        ${styles}
        <style>
            .box-container {
                display: flex;
                align-items: flex-start;
                justify-content: center;
                flex-wrap: wrap;
            }

            .spring {
                flex-grow: 1;
            }

            .box-table {
                margin: auto;
                width: auto;
            }

            table {
                table-layout: auto;
                border: solid #f57c00 1px;
            }

            th, td {
                width: auto;
            }
        </style>
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
    `
}
