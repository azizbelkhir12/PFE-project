import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionBenevolesComponent } from './gestion-benevoles.component';

describe('GestionBenevolesComponent', () => {
  let component: GestionBenevolesComponent;
  let fixture: ComponentFixture<GestionBenevolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionBenevolesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionBenevolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
