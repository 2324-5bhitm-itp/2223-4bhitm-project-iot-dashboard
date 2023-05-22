import { Component, OnInit } from '@angular/core'
import { ModelService } from './model.service'
import {mock} from "./model/mock-dashboard"
import { DashboardModel } from './model'
import { filter, map } from 'rxjs'
import {MqttService} from "ngx-mqtt";

interface AppComponentViewModel {
    name: string
    value: number
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    viewModel: AppComponentViewModel = {
        name: "",
        value: 0
    }
    constructor(private modelService: ModelService, private mqttService: MqttService) {
    }
    ngOnInit() {
        this.modelService.store
            .pipe(
                filter(dashboard => !!dashboard),
                filter(dashboard => dashboard.boxes.length > 0),
                map( dashboard => toViewModel(dashboard))
            )
            .subscribe(model => {
                this.viewModel = model

        })
        mock()

        this.mqttService.connect() // Connect to the MQTT broker

        // Subscribe to a topic (optional)
        this.mqttService.observe('myTopic').subscribe((message) => {
            console.log('Received message:', message.payload.toString())
        })
        this.mqttService.state.subscribe((state) => {
            console.log('Connection state:', state);
        });
    }

}
function toViewModel(model: DashboardModel) {
    console.log("toViewModel: ", model)
    const sensor = model.boxes[0].sensors[0]
    const vm: AppComponentViewModel = {
        name: sensor.name,
        value: sensor.value
    }
    return vm
}