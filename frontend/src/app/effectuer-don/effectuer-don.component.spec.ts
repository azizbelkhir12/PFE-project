import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EffectuerDonComponent } from './effectuer-don.component';

describe('EffectuerDonComponent', () => {
  let component: EffectuerDonComponent;
  let fixture: ComponentFixture<EffectuerDonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EffectuerDonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EffectuerDonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
