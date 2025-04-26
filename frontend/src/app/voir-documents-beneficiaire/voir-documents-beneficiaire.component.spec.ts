import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoirDocumentsBeneficiaireComponent } from './voir-documents-beneficiaire.component';

describe('VoirDocumentsBeneficiaireComponent', () => {
  let component: VoirDocumentsBeneficiaireComponent;
  let fixture: ComponentFixture<VoirDocumentsBeneficiaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VoirDocumentsBeneficiaireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoirDocumentsBeneficiaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
