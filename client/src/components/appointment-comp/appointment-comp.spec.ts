import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentComp } from './appointment-comp';

describe('AppointmentComp', () => {
  let component: AppointmentComp;
  let fixture: ComponentFixture<AppointmentComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentComp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
