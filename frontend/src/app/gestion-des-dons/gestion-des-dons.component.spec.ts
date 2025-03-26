import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDesDonsComponent } from './gestion-des-dons.component';

describe('GestionDesDonsComponent', () => {
  let component: GestionDesDonsComponent;
  let fixture: ComponentFixture<GestionDesDonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionDesDonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionDesDonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
