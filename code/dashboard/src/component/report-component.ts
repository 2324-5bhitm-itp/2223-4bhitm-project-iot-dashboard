import { html, render } from "lit-html";
import { DashboardModel, Sensor, store } from "../model";
import { filter, map } from "rxjs";

interface RoomReport {
    floor: string;
    room: string;
    sensors: Sensor[];
    actuators: Sensor[];
}

export class ReportComponent extends HTMLElement {
    private reports: RoomReport[] = [];

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        store
            .pipe(
                filter(dashboard => !!dashboard),
                filter(model => !!model.boxes),
                map(toRoomReports)
            )
            .subscribe(reports => {
                this.reports = reports;
                this.render();
            });
    }

    render() {
        render(this.template(), this.shadowRoot!);
    }

    template() {
        return html`
      <div class="report-container">
        <h2>Building Report</h2>
        <ul>
          ${this.reports.map(report => this.roomTemplate(report))}
        </ul>
      </div>
    `;
    }

    roomTemplate(report: RoomReport) {
        return html`
      <li>
        <h3>${report.floor} - ${report.room}</h3>
        <ul>
          <li><strong>Sensors:</strong> ${report.sensors.map(sensor => sensor.name).join(", ")}</li>
          <li><strong>Actuators:</strong> ${report.actuators.map(actuator => actuator.name).join(", ")}</li>
        </ul>
      </li>
    `;
    }
}

function toRoomReports(model: DashboardModel): RoomReport[] {
    const reports: RoomReport[] = [];

    model.boxes.forEach((box, name) => {
        const [floor, room] = name.split("/");
        const sensors: Sensor[] = [];
        const actuators: Sensor[] = [];

        box.sensors.forEach((sensor, sensorName) => {
            const sensorCopy = { ...sensor };

            if (isSensor(sensorCopy.name)) {
                sensors.push(sensorCopy);
            } else {
                actuators.push(sensorCopy);
            }
        });

        reports.push({ floor, room, sensors, actuators });
    });

    return reports;
}

function isSensor(sensorName: string): boolean {
    const sensorTypes = ["rssi", "co2", "noise", "motion", "temperature", "pressure", "humidity"];
    return sensorTypes.includes(sensorName);
}

customElements.define("report-component", ReportComponent);
