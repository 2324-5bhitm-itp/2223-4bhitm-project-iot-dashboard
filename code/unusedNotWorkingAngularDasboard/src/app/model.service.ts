import { Injectable } from '@angular/core';
import {DashboardModel, store} from "./model"

@Injectable({
  providedIn: 'root'
})
export class ModelService {

  constructor() {
  }
  get store() {
    return store
  }
}
