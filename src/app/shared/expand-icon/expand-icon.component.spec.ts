import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandIconComponent } from './expand-icon.component';

describe('ExpandIconComponent', () => {
  let component: ExpandIconComponent;
  let fixture: ComponentFixture<ExpandIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpandIconComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpandIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
