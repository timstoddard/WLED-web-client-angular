import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RgbSlidersComponent } from './rgb-sliders.component';

describe('RgbSlidersComponent', () => {
  let component: RgbSlidersComponent;
  let fixture: ComponentFixture<RgbSlidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RgbSlidersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RgbSlidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
