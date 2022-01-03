import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSettingsComponent } from './time-settings.component';

describe('TimeSettingsComponent', () => {
  let component: TimeSettingsComponent;
  let fixture: ComponentFixture<TimeSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
