import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormControlRequirementsComponent } from './form-control-requirements.component';

describe('FormControlRequirementsComponent', () => {
  let component: FormControlRequirementsComponent;
  let fixture: ComponentFixture<FormControlRequirementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormControlRequirementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormControlRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
