import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserModSettingsComponent } from './user-mod-settings.component';

describe('UserModSettingsComponent', () => {
  let component: UserModSettingsComponent;
  let fixture: ComponentFixture<UserModSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserModSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserModSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
