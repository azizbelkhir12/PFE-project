import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionFeedbackComponent } from './gestion-feedback.component';

describe('GestionFeedbackComponent', () => {
  let component: GestionFeedbackComponent;
  let fixture: ComponentFixture<GestionFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionFeedbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
