import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbonnementBenevoleComponent } from './abonnement-benevole.component';

describe('AbonnementBenevoleComponent', () => {
  let component: AbonnementBenevoleComponent;
  let fixture: ComponentFixture<AbonnementBenevoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AbonnementBenevoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbonnementBenevoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
