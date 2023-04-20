import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrFeedbackComponent } from './curr-feedback.component';

describe('CurrFeedbackComponent', () => {
  let component: CurrFeedbackComponent;
  let fixture: ComponentFixture<CurrFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrFeedbackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
