import { Component, OnInit } from '@angular/core';
import { MqttService } from '../mqtt.service';
import { IMqttMessage } from 'ngx-mqtt';

@Component({
  selector: 'app-mqtt-component',
  templateUrl: './mqtt-component.component.html',
  styleUrls: ['./mqtt-component.component.css'],
})
export class MqttComponentComponent implements OnInit {
  messages: string[] = [];

  constructor(private mqttService: MqttService) {}

  ngOnInit(): void {
    this.mqttService.connect().subscribe((message: IMqttMessage) => {
      this.messages.push(message.payload.toString());
    });
  }
}
