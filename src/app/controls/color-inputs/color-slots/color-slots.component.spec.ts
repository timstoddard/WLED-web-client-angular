import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorSlotsComponent } from './color-slots.component';

describe('ColorSlotsComponent', () => {
  let component: ColorSlotsComponent;
  let fixture: ComponentFixture<ColorSlotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorSlotsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
