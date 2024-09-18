import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { SectorListViewComponent } from './sector-list-view.component'

describe('SectorListViewComponent', () => {
  let component: SectorListViewComponent
  let fixture: ComponentFixture<SectorListViewComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SectorListViewComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SectorListViewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
