import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenevoleCompteComponent } from './benevole-compte.component';

describe('BenevoleCompteComponent', () => {
  let component: BenevoleCompteComponent;
  let fixture: ComponentFixture<BenevoleCompteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BenevoleCompteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BenevoleCompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
