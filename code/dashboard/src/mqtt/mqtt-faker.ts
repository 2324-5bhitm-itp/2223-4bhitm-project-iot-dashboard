/** submit demo values for simulating a real box */

import { client, mqttConfig } from "./mqtt"
import { MeasurementValue } from "../model"

setInterval(send, 100)

let counter = 0
function send() {
    if (client.isConnected()) {
        sendDummyData()
    } else {
        console.log("cannot send data, client not connected")
    }
}
function sendDummyData() {
    const name = `${createRandomBoxName()}/${createRandomSensorName()}`
    const value = Math.round(Math.random() * 50 * 100) / 100
    const val: MeasurementValue = {
        name,
        value
    }
    const payload = JSON.stringify(val, undefined, 4)
    client.send(mqttConfig.topic, payload)
}
function createRandomBoxName() {
    const roomNumber = Math.floor(Math.random() * 12) + 10
    return `e-${roomNumber}`
}
function createRandomSensorName() {
    const names = ["co2", "humidity", "temperature", "air-pressure"]
    const index = getRandomInt(0, names.length - 1)
    return names[index]
}
/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}