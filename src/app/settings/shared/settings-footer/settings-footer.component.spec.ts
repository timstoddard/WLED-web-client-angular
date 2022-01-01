import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsFooterComponent } from './settings-footer.component';

describe('SettingsFooterComponent', () => {
  let component: SettingsFooterComponent;
  let fixture: ComponentFixture<SettingsFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
