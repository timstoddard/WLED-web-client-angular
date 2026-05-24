import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormValueDisplayComponent } from './form-value-display.component';

describe('FormValueDisplayComponent', () => {
  let component: FormValueDisplayComponent;
  let fixture: ComponentFixture<FormValueDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormValueDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormValueDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
