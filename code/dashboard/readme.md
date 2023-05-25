# Demo MQTT-Client

This client connects to an [mqtt - server](./src/mqtt/mqtt.ts) and subscribes to a topic.

## MQTT messages

Use an MQTT Server and publish messages to the "sensor" topic.
the format of the messages must be the same as in the [example data](./api/mqtt/data.json)
example:
```json
{
    "name": "e58-1/co2",
    "value": 12.0
}
```
The name must contain a slash. The part before the slash is the name of the sensor box, the name behind it is the name of the sensor.

## Model View - Viewmodel Architecture and readonly state

we use a immutable state single source of truth [Model](./src/model/dashboard-model.ts) stored in a [BehaviourSubject](https://rxjs.dev/api/index/class/BehaviorSubject) using [immer.js](https://immerjs.github.io/immer/).
Incoming Data is merged into the model and a new model is published. Views subscribe to this model, convert the model to their own ViewModel and render this ViewModel.