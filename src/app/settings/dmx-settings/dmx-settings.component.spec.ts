import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmxSettingsComponent } from './dmx-settings.component';

describe('DmxSettingsComponent', () => {
  let component: DmxSettingsComponent;
  let fixture: ComponentFixture<DmxSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmxSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DmxSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
