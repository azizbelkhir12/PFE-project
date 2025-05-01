import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonateurCompteComponent } from './donateur-compte.component';

describe('DonateurCompteComponent', () => {
  let component: DonateurCompteComponent;
  let fixture: ComponentFixture<DonateurCompteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DonateurCompteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonateurCompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
