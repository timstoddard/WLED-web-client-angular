import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HexInputComponent } from './hex-input.component';

describe('HexInputComponent', () => {
  let component: HexInputComponent;
  let fixture: ComponentFixture<HexInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HexInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HexInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
