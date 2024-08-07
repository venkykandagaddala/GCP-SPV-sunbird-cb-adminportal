import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { MarketPlaceDashboardComponent } from './market-place-dashboard.component'

describe('MarketPlaceDashboardComponent', () => {
  let component: MarketPlaceDashboardComponent
  let fixture: ComponentFixture<MarketPlaceDashboardComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MarketPlaceDashboardComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketPlaceDashboardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
