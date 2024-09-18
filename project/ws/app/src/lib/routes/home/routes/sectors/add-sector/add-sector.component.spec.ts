import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { AddSectorComponent } from './add-sector.component'

describe('AddSectorComponent', () => {
  let component: AddSectorComponent
  let fixture: ComponentFixture<AddSectorComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddSectorComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSectorComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
