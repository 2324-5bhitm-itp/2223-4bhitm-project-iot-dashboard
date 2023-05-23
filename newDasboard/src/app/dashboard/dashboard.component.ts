import {Component, OnInit} from '@angular/core';
import {ModelService} from "../model.service";
import {filter, map} from "rxjs";
import {mock} from "../model/mock-dashboard";
import {DashboardModel} from "../model";

interface DashboardComponentViewModel {
  name: string
  value: number
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  viewModel: DashboardComponentViewModel = {
    name: "",
    value: 0
  }
  constructor(private modelService: ModelService) {
  }
  ngOnInit() {
    mock()
    this.modelService.store
        .pipe(
            filter(dashboard => !!dashboard),
            filter(dashboard => dashboard.boxes.length > 0),
            map( dashboard => toViewModel(dashboard))
        )
        .subscribe(model => {
          this.viewModel = model
        })
  }
}
function toViewModel(model: DashboardModel) {
  console.log("toViewModel: ", model)
  const sensor = model.boxes[0].sensors[0]
  const vm: DashboardComponentViewModel = {
    name: sensor.name,
    value: sensor.value
  }
  return vm
}
