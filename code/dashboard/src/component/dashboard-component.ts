import {html, render} from "lit-html"
import {DashboardModel, Sensor, store} from "../model"
import { distinctUntilChanged, filter, map } from "rxjs"
import _ from "lodash"
import { styles } from "../styles/styles"
import { mqttConfig } from "../mqtt"

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
                map(dashboard => toViewModel(dashboard))
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
function boxTempate(box: BoxViewModel) {
    const rows = box.sensors.map(sensor => html`<tr><td>${sensor.name}</td><td class="w3-right">${sensor.value}</td></tr>`)
    return html`
        <div class="w3-container">
            <div class="w3-panel">
                <div class="w3-card box-table">
                    <table class="w3-table-all">
                    <caption>Box ${box.name}</caption>
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td class="w3-right">Value</td>
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
function template(vm: AppComponentViewModel)  {
    const boxes = vm.boxes.map(boxTempate)
    return html`
    ${styles}
    <style>
        .box-table {
            width: 20rem;
            margin-left: auto;
            margin-right: auto;
        }
    </style>
    <div class="w3-container">
        <h3 class="w3-panel w3-center">Listening to mqtt topic
        "<span class="w3-text-green">${mqttConfig.topic}</span>" on host ws://${mqttConfig.host}:${mqttConfig.port}
        </h3>
    </div>
    <section>
    ${boxes}
    </section>
    `
}
