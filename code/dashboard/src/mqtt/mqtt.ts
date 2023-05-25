/**
 * paho javascript client, see https://github.com/eclipse/paho.mqtt.javascript#readme
 */
import {Client, ErrorWithInvocationContext, Message} from "paho-mqtt"
import { MeasurementValue } from "../model"
import { store } from "../model"
import { produce } from "immer"

interface MqttConfig {
    host: string
    port: number
    clientId: string
    topic: string
}
export const mqttConfig: MqttConfig = {
    host: "localhost",
    port: 9001,
    clientId: "iot-dashboard-demo",
    topic: "sensor"
}
let client: Client

connect()
setInterval(() => checkConnection(), 2000)
function connect() {
    client = new Client(mqttConfig.host, mqttConfig.port, mqttConfig.clientId)
    console.log("connecting...")
    client.onMessageArrived = onMessageArrived
    client.onConnectionLost = onConnectionLost
        client.connect({
        onSuccess: onConnect,
        onFailure: onConnectError
    })
}
function onConnect() {
    console.log("connected to mqtt", mqttConfig)
    client.subscribe(mqttConfig.topic)
}
function onMessageArrived(message: Message) {
    const measurement: MeasurementValue = JSON.parse(message.payloadString)
    console.log("message received", measurement)
    const current = store.getValue()
    const parts = measurement.name.split("/")
    const boxName = parts[0]
    const sensorName = parts[1]
    const next = produce(current, model => {
        let box = model.boxes.get(boxName)
        if (!box) {
            box = {
                name: boxName,
                sensors: new Map()
            }
            model.boxes.set(boxName, box)
        }
        let sensor = box.sensors.get(sensorName)
        if (!sensor) {
            sensor = {
                name: sensorName,
                lastValueReceivedAt: 0,
                value: 0  
            }
            box.sensors.set(sensorName, sensor)
        }
        sensor.lastValueReceivedAt = new Date().getTime()
        sensor.value = measurement.value
        console.log("sensor is", sensor)
    })
    console.log("submit", next)
    store.next(next)
}
function checkConnection() {
    console.log("check connection...")
    if (!client || !client.isConnected()) {
        client = null
        console.log("not connected")
        connect()
    } else {
        console.log("connection is OK")
    }
}
function onConnectionLost() {
    console.log("connection lost", client.isConnected())
}
function onConnectError(e: ErrorWithInvocationContext): void {
    console.log("failed to connect: ", e)
}

