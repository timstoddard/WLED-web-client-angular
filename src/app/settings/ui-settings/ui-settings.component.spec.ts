import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UISettingsComponent } from './ui-settings.component';

describe('UISettingsComponent', () => {
  let component: UISettingsComponent;
  let fixture: ComponentFixture<UISettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UISettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UISettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
