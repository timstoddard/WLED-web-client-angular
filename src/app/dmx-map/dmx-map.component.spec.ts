import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmxMapComponent } from './dmx-map.component';

describe('DmxMapComponent', () => {
  let component: DmxMapComponent;
  let fixture: ComponentFixture<DmxMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmxMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DmxMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
