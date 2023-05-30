/**
 * paho javascript client, see https://github.com/eclipse/paho.mqtt.javascript#readme
 */
import {Client, ErrorWithInvocationContext, MQTTError, Message} from "paho-mqtt"
import { MeasurementValue } from "../model"
import { store } from "../model"
import { produce } from "immer"

interface MqttConfig {
    host: string
    port: number
    path: string
    clientId: string
    topic: string
}

interface ConnectionOptions {

    userName: string
    password: string
    /*onSuccess: onConnect,
    onFailure: onConnectError*/
}


export let client: Client

export const mqttConfig: MqttConfig = {
    host: "mqtt.htl-leonding.ac.at",
    port: 9418,
    clientId: "iot-dashboard-demo",
    path: "/ws",
    topic: "eg"
}

export const mqttConnectionOptions : ConnectionOptions ={
    userName: "leo-student",
    password: "sTuD@w0rck"
}

connect()
setInterval(() => checkConnection(), 5000)
function connect() {
    client = new Client(mqttConfig.host, mqttConfig.port, mqttConfig.path, mqttConfig.clientId)
    console.log("connecting...")
    client.onMessageArrived = onMessageArrived
    client.onConnectionLost = onConnectionLost
        setConnected(false)
        client.connect({
            onSuccess: onConnect,
            onFailure: onConnectError,
            userName: "leo-student",
            password: "sTuD@w0rck"})
}
function onConnect() {
    console.log("connected to mqtt", mqttConfig)
    client.subscribe(mqttConfig.topic)
    setConnected(true)
}
function onMessageArrived(message: Message) {
    const measurement: MeasurementValue = JSON.parse(message.payloadString)
    const parts = measurement.name.split("/")
    const boxName = parts[0]
    const sensorName = parts[1]
    const next = produce(store.getValue(), model => {
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
    })
    store.next(next)
}
function checkConnection() {
    if (!client || !client.isConnected()) {
        setConnected(false)
        client = null
        console.log("not connected")
        connect()
    }
}
function onConnectionLost(error: MQTTError) {
    console.log("connection lost", error)
    setConnected(false)
}
function onConnectError(e: ErrorWithInvocationContext) {
    console.log("failed to connect: ", e)
}
function setConnected(connected: boolean) {
    const next = produce(store.getValue(), model => {
        model.connected = connected
    })
    store.next(next)

}
