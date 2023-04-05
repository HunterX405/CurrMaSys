import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnableUserComponent } from './enable-user.component';

describe('EnableUserComponent', () => {
  let component: EnableUserComponent;
  let fixture: ComponentFixture<EnableUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnableUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnableUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
