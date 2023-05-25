import { DashboardModel, Sensor, SensorBox, store } from "./dashboard-model"

let timer
export function mock() {
    timer = setInterval(submit, 1000)
}
let currentValue = 0
function submit() {
    const model = createModel()
    console.log("send", model)
    store.next(model)
}
function createModel() {
    const sensor: Sensor = {
        name: "Dummy",
        lastValueReceivedAt: new Date().getTime(),
        value: currentValue++
    }
    const box: SensorBox = {
        name: "Dummy",
        sensors: [sensor]
    }
    const model: DashboardModel = {
        boxes: [box]
    }
    return model
}