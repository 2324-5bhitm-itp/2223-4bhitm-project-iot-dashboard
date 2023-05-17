import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MqttService } from 'ngx-mqtt';
import { MQTT_CONFIG } from './mqtt.config';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: MqttService,
      useFactory: () => {
        return new MqttService(MQTT_CONFIG);
      },
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
