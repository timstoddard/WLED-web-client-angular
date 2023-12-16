import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EffectsFilterComponent } from './effects-filter.component';

describe('EffectsFilterComponent', () => {
  let component: EffectsFilterComponent;
  let fixture: ComponentFixture<EffectsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EffectsFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EffectsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
