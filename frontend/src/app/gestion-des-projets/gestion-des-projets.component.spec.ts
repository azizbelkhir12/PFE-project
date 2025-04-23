import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDesProjetsComponent } from './gestion-des-projets.component';

describe('GestionDesProjetsComponent', () => {
  let component: GestionDesProjetsComponent;
  let fixture: ComponentFixture<GestionDesProjetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionDesProjetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionDesProjetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
