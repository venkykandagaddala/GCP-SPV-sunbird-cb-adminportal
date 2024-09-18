import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { CommsComponent } from './comms.component'

describe('CommsComponent', () => {
  let component: CommsComponent
  let fixture: ComponentFixture<CommsComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CommsComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CommsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
