import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorInputsComponent } from './color-inputs.component';

describe('ColorInputsComponent', () => {
  let component: ColorInputsComponent;
  let fixture: ComponentFixture<ColorInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorInputsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
