import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveViewWsComponent } from './live-view-ws.component';

describe('LiveViewWsComponent', () => {
  let component: LiveViewWsComponent;
  let fixture: ComponentFixture<LiveViewWsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveViewWsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveViewWsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
