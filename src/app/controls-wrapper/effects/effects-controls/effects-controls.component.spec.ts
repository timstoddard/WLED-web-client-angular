import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EffectsControlsComponent } from './effects-controls.component';

describe('EffectsControlsComponent', () => {
  let component: EffectsControlsComponent;
  let fixture: ComponentFixture<EffectsControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EffectsControlsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EffectsControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
