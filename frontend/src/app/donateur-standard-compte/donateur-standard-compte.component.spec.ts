import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonateurStandardCompteComponent } from './donateur-standard-compte.component';

describe('DonateurStandardCompteComponent', () => {
  let component: DonateurStandardCompteComponent;
  let fixture: ComponentFixture<DonateurStandardCompteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DonateurStandardCompteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonateurStandardCompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
