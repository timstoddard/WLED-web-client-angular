import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhitenessSlidersComponent } from './whiteness-sliders.component';

describe('WhitenessSlidersComponent', () => {
  let component: WhitenessSlidersComponent;
  let fixture: ComponentFixture<WhitenessSlidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhitenessSlidersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhitenessSlidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
