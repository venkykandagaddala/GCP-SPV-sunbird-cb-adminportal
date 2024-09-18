import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { EmailDomainsComponent } from './email-domains.component'

describe('OnboardingRequestsComponent', () => {
  let component: EmailDomainsComponent
  let fixture: ComponentFixture<EmailDomainsComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EmailDomainsComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailDomainsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
