import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaireCompteComponent } from './beneficiaire-compte.component';

describe('BeneficiaireCompteComponent', () => {
  let component: BeneficiaireCompteComponent;
  let fixture: ComponentFixture<BeneficiaireCompteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BeneficiaireCompteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiaireCompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
