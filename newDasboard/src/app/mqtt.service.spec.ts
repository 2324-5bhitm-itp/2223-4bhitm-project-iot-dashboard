import { TestBed } from '@angular/core/testing';

import { MqttConnectionService } from './mqttConnectionService';

describe('MqttService', () => {
  let service: MqttConnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MqttConnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
