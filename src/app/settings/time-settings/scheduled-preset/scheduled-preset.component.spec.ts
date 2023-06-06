import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledPresetComponent } from './scheduled-preset.component';

describe('TimeBasedPresetComponent', () => {
  let component: ScheduledPresetComponent;
  let fixture: ComponentFixture<ScheduledPresetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduledPresetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduledPresetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
