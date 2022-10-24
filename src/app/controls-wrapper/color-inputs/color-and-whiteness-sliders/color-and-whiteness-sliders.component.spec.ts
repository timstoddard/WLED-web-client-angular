import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorAndWhitenessSlidersComponent } from './color-and-whiteness-sliders.component';

describe('ColorAndWhitenessSlidersComponent', () => {
  let component: ColorAndWhitenessSlidersComponent;
  let fixture: ComponentFixture<ColorAndWhitenessSlidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorAndWhitenessSlidersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorAndWhitenessSlidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
