import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { CompetencyViewComponent } from './competency-view.component'

describe('CompetencyViewComponent', () => {
  let component: CompetencyViewComponent
  let fixture: ComponentFixture<CompetencyViewComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CompetencyViewComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetencyViewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
