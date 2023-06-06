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
    topic: "eg/e58_2/temperature/#"
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
            userName: mqttConnectionOptions.userName,
            password: mqttConnectionOptions.password})
}
function onConnect() {
    console.log("connected to mqtt", mqttConfig)
    client.subscribe(mqttConfig.topic)
    setConnected(true)
}
function onMessageArrived(message: Message) {
    console.log("Message", message)
    const measurement: MeasurementValue = JSON.parse(message.payloadString)
    console.log(measurement.value)
    const parts = message.destinationName.split("/")
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
    //console.log(client.isConnected());
    if (!client || !client.isConnected()) {
        setConnected(false)
        client = null
        console.log("not connected")
        connect()
    } else {
        console.log("checkConnection ok")
    } 
}
function onConnectionLost(error: MQTTError) {
    console.log("connection lost", error)
    setConnected(false)
}
function onConnectError(e: ErrorWithInvocationContext) {
    console.log("failed to connect: ", e)
    setConnected(false)
}
function setConnected(connected: boolean) {
    const next = produce(store.getValue(), model => {
        model.connected = connected
    })
    store.next(next)

}
