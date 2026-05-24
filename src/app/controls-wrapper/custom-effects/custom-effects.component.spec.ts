import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomEffectsComponent } from './custom-effects.component';

describe('CustomEffectsComponent', () => {
  let component: CustomEffectsComponent;
  let fixture: ComponentFixture<CustomEffectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomEffectsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomEffectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
