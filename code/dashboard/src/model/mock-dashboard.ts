import { DashboardModel, Sensor, SensorBox, store } from "./dashboard-model"

export function mock() {
    setInterval(submit, 1000)
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
        sensors: new Map()
    }
    const model: DashboardModel = {
        boxes: new Map()
    }
    return model
}