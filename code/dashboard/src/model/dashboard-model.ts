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
    readonly selectedFloor: string
}

const initialState: DashboardModel = {
    connected: false,
    boxes: new Map(),
    selectedFloor: 'EG'
}

export const store = new BehaviorSubject<DashboardModel>(initialState)

export const unitOfSensorName: Record<string, string> = {
    "humidity": "%",
    "temperature": "°C",
    "co2": "ppm",
    "pressure": "hPa",
    "luminosity": "lm/m²"
}
