import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ImageCropComponent } from './image-crop.component'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar'

describe('ImageCropComponent', () => {
  let component: ImageCropComponent
  let fixture: ComponentFixture<ImageCropComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, MatSnackBarModule],
      declarations: [ImageCropComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MatSnackBarRef, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageCropComponent)
    component = fixture.componentInstance
    // fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
