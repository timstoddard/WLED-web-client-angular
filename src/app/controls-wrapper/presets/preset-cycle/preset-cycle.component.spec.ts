import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresetCycleComponent } from './preset-cycle.component';

describe('PresetCycleComponent', () => {
  let component: PresetCycleComponent;
  let fixture: ComponentFixture<PresetCycleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PresetCycleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PresetCycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
