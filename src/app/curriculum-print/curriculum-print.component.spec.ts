import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumPrintComponent } from './curriculum-print.component';

describe('CurriculumPrintComponent', () => {
  let component: CurriculumPrintComponent;
  let fixture: ComponentFixture<CurriculumPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurriculumPrintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurriculumPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
