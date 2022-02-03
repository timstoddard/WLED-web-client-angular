import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresetFormComponent } from './preset-form.component';

describe('PresetFormComponent', () => {
  let component: PresetFormComponent;
  let fixture: ComponentFixture<PresetFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PresetFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PresetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
