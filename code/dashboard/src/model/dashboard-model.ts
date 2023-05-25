import { BehaviorSubject } from "rxjs"

export interface SensorBox {
    readonly name: string
    readonly sensors: Map<string, Sensor>
}
export interface Sensor {
    readonly name: string
    readonly lastValueReceivedAt: number
    readonly value: number
}

export interface DashboardModel {
    readonly connected: boolean // are we connected to mqtt?
    readonly boxes: Map<string, SensorBox>
}

const initialState: DashboardModel = {
    connected: false,
    boxes: new Map()
}

export const store = new BehaviorSubject<DashboardModel>(initialState)

