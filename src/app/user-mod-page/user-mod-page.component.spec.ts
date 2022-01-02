import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserModPageComponent } from './user-mod-page.component';

describe('UserModPageComponent', () => {
  let component: UserModPageComponent;
  let fixture: ComponentFixture<UserModPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserModPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserModPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
