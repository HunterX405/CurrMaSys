import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditElectiveComponent } from './edit-elective.component';

describe('EditElectiveComponent', () => {
  let component: EditElectiveComponent;
  let fixture: ComponentFixture<EditElectiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditElectiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditElectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
