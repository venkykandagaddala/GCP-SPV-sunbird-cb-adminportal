import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ImageCropComponent } from './image-crop.component'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { MatLegacyDialogModule as MatDialogModule, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog'
import { MatLegacySnackBarModule as MatSnackBarModule, MatLegacySnackBarRef as MatSnackBarRef } from '@angular/material/legacy-snack-bar'

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
