import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeBasedPresetComponent } from './time-based-preset.component';

describe('TimeBasedPresetComponent', () => {
  let component: TimeBasedPresetComponent;
  let fixture: ComponentFixture<TimeBasedPresetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeBasedPresetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeBasedPresetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
