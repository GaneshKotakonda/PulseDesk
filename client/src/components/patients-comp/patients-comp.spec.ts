import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsComp } from './patients-comp';

describe('PatientsComp', () => {
  let component: PatientsComp;
  let fixture: ComponentFixture<PatientsComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientsComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientsComp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
