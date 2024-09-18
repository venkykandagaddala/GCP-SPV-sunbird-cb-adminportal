import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { OpenRolesDialogComponent } from './open-roles-dialog.component'

describe('OpenRolesDialogComponent', () => {
  let component: OpenRolesDialogComponent
  let fixture: ComponentFixture<OpenRolesDialogComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OpenRolesDialogComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenRolesDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
