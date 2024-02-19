import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EffectsSettingsComponent } from './effects-settings.component';

describe('EffectsSettingsComponent', () => {
  let component: EffectsSettingsComponent;
  let fixture: ComponentFixture<EffectsSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EffectsSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EffectsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
