import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesPreviewComponent } from './courses-preview.component';

describe('CoursesPreviewComponent', () => {
  let component: CoursesPreviewComponent;
  let fixture: ComponentFixture<CoursesPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursesPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
