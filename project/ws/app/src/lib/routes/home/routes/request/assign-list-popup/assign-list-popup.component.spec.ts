import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { AssignListPopupComponent } from './assign-list-popup.component'

describe('AssignListPopupComponent', () => {
  let component: AssignListPopupComponent
  let fixture: ComponentFixture<AssignListPopupComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AssignListPopupComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignListPopupComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
