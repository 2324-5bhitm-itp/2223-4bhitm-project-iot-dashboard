import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MqttComponentComponent } from './mqtt-component.component';

describe('MqttComponentComponent', () => {
  let component: MqttComponentComponent;
  let fixture: ComponentFixture<MqttComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MqttComponentComponent]
    });
    fixture = TestBed.createComponent(MqttComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
