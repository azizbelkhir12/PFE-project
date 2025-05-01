import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDonateurComponent } from './profile-donateur.component';

describe('ProfileDonateurComponent', () => {
  let component: ProfileDonateurComponent;
  let fixture: ComponentFixture<ProfileDonateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileDonateurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileDonateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
