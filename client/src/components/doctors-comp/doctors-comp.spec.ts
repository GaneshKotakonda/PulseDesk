import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsComp } from './doctors-comp';

describe('DoctorsComp', () => {
  let component: DoctorsComp;
  let fixture: ComponentFixture<DoctorsComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorsComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorsComp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
