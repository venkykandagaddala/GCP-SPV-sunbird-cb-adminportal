import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { AddThumbnailComponent } from './add-thumbnail.component'

describe('AddThumbnailComponent', () => {
  let component: AddThumbnailComponent
  let fixture: ComponentFixture<AddThumbnailComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddThumbnailComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AddThumbnailComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
