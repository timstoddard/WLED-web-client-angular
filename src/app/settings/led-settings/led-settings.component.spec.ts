import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedSettingsComponent } from './led-settings.component';

describe('LedSettingsComponent', () => {
  let component: LedSettingsComponent;
  let fixture: ComponentFixture<LedSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LedSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LedSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
