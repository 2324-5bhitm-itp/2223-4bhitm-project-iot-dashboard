import { BehaviorSubject } from "rxjs"

export interface SensorBox {
    name: string
    sensors: Sensor[]
}
export interface Sensor {
    name: string
    lastValueReceivedAt: number
    value: number
}

export interface DashboardModel {
    boxes: SensorBox[]
}

const initialState: DashboardModel = {
    boxes: []
}

export const store = new BehaviorSubject<DashboardModel>(initialState)

