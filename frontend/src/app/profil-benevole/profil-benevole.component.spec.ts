import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilBenevoleComponent } from './profil-benevole.component';

describe('ProfilBenevoleComponent', () => {
  let component: ProfilBenevoleComponent;
  let fixture: ComponentFixture<ProfilBenevoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfilBenevoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilBenevoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
