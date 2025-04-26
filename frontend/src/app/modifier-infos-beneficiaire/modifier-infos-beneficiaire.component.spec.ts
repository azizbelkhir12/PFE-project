import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierInfosBeneficiaireComponent } from './modifier-infos-beneficiaire.component';

describe('ModifierInfosBeneficiaireComponent', () => {
  let component: ModifierInfosBeneficiaireComponent;
  let fixture: ComponentFixture<ModifierInfosBeneficiaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierInfosBeneficiaireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierInfosBeneficiaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
