import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {IMqttMessage} from "ngx-mqtt";

@Injectable({
    providedIn: 'root',
})
export class MqttService {
    constructor(private mqttService: MqttService) {}

    connect(): Observable<IMqttMessage> {
        return this.mqttService.observe('topic'); // Replace 'topic' with the actual MQTT topic to subscribe to
    }

    private observe(topic: string) {
        return undefined;
    }
}
