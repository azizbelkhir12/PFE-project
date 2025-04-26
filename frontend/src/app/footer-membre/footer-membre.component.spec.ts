import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterMembreComponent } from './footer-membre.component';

describe('FooterMembreComponent', () => {
  let component: FooterMembreComponent;
  let fixture: ComponentFixture<FooterMembreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterMembreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterMembreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
