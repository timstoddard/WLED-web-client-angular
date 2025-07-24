import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonActionsComponent } from './button-actions.component';

describe('ButtonActionsComponent', () => {
  let component: ButtonActionsComponent;
  let fixture: ComponentFixture<ButtonActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonActionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
