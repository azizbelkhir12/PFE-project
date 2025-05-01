import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParinnageEnfantsComponent } from './parinnage-enfants.component';

describe('ParinnageEnfantsComponent', () => {
  let component: ParinnageEnfantsComponent;
  let fixture: ComponentFixture<ParinnageEnfantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParinnageEnfantsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParinnageEnfantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
