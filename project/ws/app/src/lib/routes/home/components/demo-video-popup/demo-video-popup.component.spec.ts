import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoVideoPopupComponent } from './demo-video-popup.component';

describe('DemoVideoPopupComponent', () => {
  let component: DemoVideoPopupComponent;
  let fixture: ComponentFixture<DemoVideoPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoVideoPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoVideoPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
