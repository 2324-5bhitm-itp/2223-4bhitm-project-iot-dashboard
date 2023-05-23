import { Injectable } from '@angular/core';
import {ModelService} from "./model.service";
import {IMqttServiceOptions, MqttService} from "ngx-mqtt";

@Injectable({
  providedIn: 'root'
})

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: 'localhost',
  port: 9001,
  connectOnCreate: true,  // Enable verbose logging
  path: '/ws',
  protocol: 'ws', // WebSocket protocol
};

export class MqttConnectionService {
  constructor(private modelService: ModelService, private mqttService: MqttService) {
    this.mqttService.connect() // Connect to the MQTT broker

    // Subscribe to a topic (optional)
    this.mqttService.observe('myTopic').subscribe((message) => {
      console.log('Received message:', message.payload.toString())
    })
    this.mqttService.state.subscribe((state) => {
      console.log('Connection state:', state);
    })
  }
}
