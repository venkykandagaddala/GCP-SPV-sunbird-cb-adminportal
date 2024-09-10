import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { HelpCenterGuideComponent } from './help-center-guide.component'

describe('HelpCenterGuideComponent', () => {
  let component: HelpCenterGuideComponent
  let fixture: ComponentFixture<HelpCenterGuideComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HelpCenterGuideComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpCenterGuideComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
