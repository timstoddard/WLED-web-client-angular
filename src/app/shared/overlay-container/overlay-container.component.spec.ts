import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayContainerComponent } from './overlay-container.component';

describe('OverlayContainerComponent', () => {
  let component: OverlayContainerComponent;
  let fixture: ComponentFixture<OverlayContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverlayContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverlayContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
