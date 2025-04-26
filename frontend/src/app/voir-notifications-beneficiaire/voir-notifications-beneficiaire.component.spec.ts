import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoirNotificationsBeneficiaireComponent } from './voir-notifications-beneficiaire.component';

describe('VoirNotificationsBeneficiaireComponent', () => {
  let component: VoirNotificationsBeneficiaireComponent;
  let fixture: ComponentFixture<VoirNotificationsBeneficiaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VoirNotificationsBeneficiaireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoirNotificationsBeneficiaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
