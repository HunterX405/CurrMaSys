import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackPrintComponent } from './feedback-print.component';

describe('FeedbackPrintComponent', () => {
  let component: FeedbackPrintComponent;
  let fixture: ComponentFixture<FeedbackPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackPrintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
