/** submit demo values for simulating a real box */

import { Message } from "paho-mqtt"
import { client, mqttConfig } from "./mqtt"
import { MeasurementValue } from "../model"

setInterval(send, 250)

let counter = 0
function send() {
    if (client.isConnected()) {
        sendDummyData()
    } else {
        console.log("cannot send data, client not connected")
    }
}
function sendDummyData() {
    const MAX = 40
    counter++
    counter %= MAX 
    const values: MeasurementValue[] = [
        {
            name: "e58-1/counter",
            value: counter
        },
        {
            name: "e58-1/cos",
            value: Math.round(Math.random() * MAX * 100) / 100
        },
        {
            name: "edv8/temperature",
            value: Math.round(Math.random() * MAX/2 * 100) / 100
        },

    ]
    const randonIndexOfValuetoSend = getRandomInt(0, values.length - 1)
    const value = values[randonIndexOfValuetoSend]
    const payload = JSON.stringify(value, undefined, 4)
    client.send(mqttConfig.topic, payload)
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