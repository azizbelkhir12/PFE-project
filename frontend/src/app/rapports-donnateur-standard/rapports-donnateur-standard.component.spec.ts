import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportsDonnateurStandardComponent } from './rapports-donnateur-standard.component';

describe('RapportsDonnateurStandardComponent', () => {
  let component: RapportsDonnateurStandardComponent;
  let fixture: ComponentFixture<RapportsDonnateurStandardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RapportsDonnateurStandardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RapportsDonnateurStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
