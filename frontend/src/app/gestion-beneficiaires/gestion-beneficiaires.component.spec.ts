import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionBeneficiairesComponent } from './gestion-beneficiaires.component';

describe('GestionBeneficiairesComponent', () => {
  let component: GestionBeneficiairesComponent;
  let fixture: ComponentFixture<GestionBeneficiairesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionBeneficiairesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionBeneficiairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
