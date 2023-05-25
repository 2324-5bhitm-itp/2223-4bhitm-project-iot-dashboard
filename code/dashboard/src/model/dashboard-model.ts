import { BehaviorSubject } from "rxjs"

export interface SensorBox {
    name: string
    sensors: Map<string, Sensor>
}
export interface Sensor {
    name: string
    lastValueReceivedAt: number
    value: number
}

export interface DashboardModel {
    boxes: Map<string, SensorBox>
}

const initialState: DashboardModel = {
    boxes: new Map()
}

export const store = new BehaviorSubject<DashboardModel>(initialState)

