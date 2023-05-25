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
    readonly boxes: Map<string, SensorBox>
}

const initialState: DashboardModel = {
    boxes: new Map()
}

export const store = new BehaviorSubject<DashboardModel>(initialState)

