import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeviceFormComponent } from './add-device-form.component';

describe('AddDeviceFormComponent', () => {
  let component: AddDeviceFormComponent;
  let fixture: ComponentFixture<AddDeviceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDeviceFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDeviceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
