import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSegmentComponent } from './new-segment.component';

describe('NewSegmentComponent', () => {
  let component: NewSegmentComponent;
  let fixture: ComponentFixture<NewSegmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSegmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
