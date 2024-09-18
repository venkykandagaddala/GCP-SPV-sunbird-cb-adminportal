import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { RolesUsersComponent } from './roles-users.component'

describe('RolesUsersComponent', () => {
  let component: RolesUsersComponent
  let fixture: ComponentFixture<RolesUsersComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RolesUsersComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesUsersComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
