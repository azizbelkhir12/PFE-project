import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonRapideComponent } from './don-rapide.component';

describe('DonRapideComponent', () => {
  let component: DonRapideComponent;
  let fixture: ComponentFixture<DonRapideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DonRapideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonRapideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
