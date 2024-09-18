import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { KCMMappingComponent } from './kcm-mapping.component'

describe('KCMMappingComponent', () => {
  let component: KCMMappingComponent
  let fixture: ComponentFixture<KCMMappingComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [KCMMappingComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(KCMMappingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
