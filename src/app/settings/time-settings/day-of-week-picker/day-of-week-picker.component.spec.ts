import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayOfWeekPickerComponent } from './day-of-week-picker.component';

describe('DayOfWeekPickerComponent', () => {
  let component: DayOfWeekPickerComponent;
  let fixture: ComponentFixture<DayOfWeekPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayOfWeekPickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayOfWeekPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
