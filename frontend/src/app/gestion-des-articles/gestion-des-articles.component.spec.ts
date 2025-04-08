import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDesArticlesComponent } from './gestion-des-articles.component';

describe('GestionDesArticlesComponent', () => {
  let component: GestionDesArticlesComponent;
  let fixture: ComponentFixture<GestionDesArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionDesArticlesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionDesArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
