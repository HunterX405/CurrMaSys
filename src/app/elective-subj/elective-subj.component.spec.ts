import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectiveSubjComponent } from './elective-subj.component';

describe('ElectiveSubjComponent', () => {
  let component: ElectiveSubjComponent;
  let fixture: ComponentFixture<ElectiveSubjComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectiveSubjComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElectiveSubjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
