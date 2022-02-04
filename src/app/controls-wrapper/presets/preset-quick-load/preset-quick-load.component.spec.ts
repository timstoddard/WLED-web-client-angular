import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresetQuickLoadComponent } from './preset-quick-load.component';

describe('PresetQuickLoadComponent', () => {
  let component: PresetQuickLoadComponent;
  let fixture: ComponentFixture<PresetQuickLoadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PresetQuickLoadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PresetQuickLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
