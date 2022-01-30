import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomMenuBarComponent } from './bottom-menu-bar.component';

describe('BottomMenuBarComponent', () => {
  let component: BottomMenuBarComponent;
  let fixture: ComponentFixture<BottomMenuBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BottomMenuBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomMenuBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
