import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDesRapportsComponent } from './gestion-des-rapports.component';

describe('GestionDesRapportsComponent', () => {
  let component: GestionDesRapportsComponent;
  let fixture: ComponentFixture<GestionDesRapportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionDesRapportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionDesRapportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
