import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { AcbpReportsComponent } from './acbp-reports.component'

describe('AcbpReportsComponent', () => {
  let component: AcbpReportsComponent
  let fixture: ComponentFixture<AcbpReportsComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AcbpReportsComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AcbpReportsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
