import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { GeneralReportsComponent } from './general-reports.component'

describe('GeneralReportsComponent', () => {
  let component: GeneralReportsComponent
  let fixture: ComponentFixture<GeneralReportsComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GeneralReportsComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralReportsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
