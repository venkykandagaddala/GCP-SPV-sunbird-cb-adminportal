import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { SolutionSurveyUploadComponent } from './solution-survey-upload.component'

describe('SolutionSurveyUploadComponent', () => {
  let component: SolutionSurveyUploadComponent
  let fixture: ComponentFixture<SolutionSurveyUploadComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SolutionSurveyUploadComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SolutionSurveyUploadComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
