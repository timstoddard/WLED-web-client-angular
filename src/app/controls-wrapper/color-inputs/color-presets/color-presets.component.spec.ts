import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPresetsComponent } from './color-presets.component';

describe('ColorPresetsComponent', () => {
  let component: ColorPresetsComponent;
  let fixture: ComponentFixture<ColorPresetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorPresetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPresetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
