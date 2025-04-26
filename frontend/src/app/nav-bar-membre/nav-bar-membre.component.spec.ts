import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarMembreComponent } from './nav-bar-membre.component';

describe('NavBarMembreComponent', () => {
  let component: NavBarMembreComponent;
  let fixture: ComponentFixture<NavBarMembreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavBarMembreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavBarMembreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
