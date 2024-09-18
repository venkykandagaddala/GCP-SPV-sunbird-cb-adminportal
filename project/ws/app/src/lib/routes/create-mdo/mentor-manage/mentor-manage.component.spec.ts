import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { MentorManageComponent } from './mentor-manage.component'

describe('MentorManageComponent', () => {
  let component: MentorManageComponent
  let fixture: ComponentFixture<MentorManageComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MentorManageComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorManageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
