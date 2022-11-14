import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentListComponent } from './segment-list.component';

describe('SegmentListComponent', () => {
  let component: SegmentListComponent;
  let fixture: ComponentFixture<SegmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SegmentListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SegmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
