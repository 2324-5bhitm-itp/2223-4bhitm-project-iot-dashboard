import { TestBed } from '@angular/core/testing';

import { MqttConnectionService } from './mqtt-connection.service';

describe('MqttConnectionService', () => {
  let service: MqttConnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MqttConnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
