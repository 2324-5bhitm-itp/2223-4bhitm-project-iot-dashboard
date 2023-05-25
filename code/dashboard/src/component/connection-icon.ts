import { distinctUntilChanged, map } from "rxjs"
import { store } from "../model"
import { html, render } from "lit-html"

class MqttConnectionIcon extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        console.log("icon connected")
        store
            .pipe(
                distinctUntilChanged(undefined, model => model.connected),
                map(model => model.connected)
            )
            .subscribe(connected => render(template(connected), this))
    }
}
function template(connected: boolean) {
    const clazz = connected ? "w3-text-green" : "w3-text-red"
    return html`
        <span class="material-icons ${clazz}">
        ${connected ? "wifi" : "wifi_off"}
        </span>
    `
}
customElements.define("mqtt-connected-icon", MqttConnectionIcon)