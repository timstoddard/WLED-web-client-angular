import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PalettesSettingsComponent } from './palettes-settings.component';

describe('PalettesSettingsComponent', () => {
  let component: PalettesSettingsComponent;
  let fixture: ComponentFixture<PalettesSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PalettesSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PalettesSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
