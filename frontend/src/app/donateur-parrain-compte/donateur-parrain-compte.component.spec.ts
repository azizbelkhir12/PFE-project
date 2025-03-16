import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonateurParrainCompteComponent } from './donateur-parrain-compte.component';

describe('DonateurParrainCompteComponent', () => {
  let component: DonateurParrainCompteComponent;
  let fixture: ComponentFixture<DonateurParrainCompteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DonateurParrainCompteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonateurParrainCompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
