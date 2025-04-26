import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterDesDocumentsBeneficiaireComponent } from './ajouter-des-documents-beneficiaire.component';

describe('AjouterDesDocumentsBeneficiaireComponent', () => {
  let component: AjouterDesDocumentsBeneficiaireComponent;
  let fixture: ComponentFixture<AjouterDesDocumentsBeneficiaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjouterDesDocumentsBeneficiaireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouterDesDocumentsBeneficiaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
