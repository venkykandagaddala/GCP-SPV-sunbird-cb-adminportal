import { ActivatedRoute, Router } from '@angular/router'
import { MentorManageComponent } from './mentor-manage.component'
import { BehaviorSubject, of, Subject } from 'rxjs'
import { MatDialog } from '@angular/material/dialog'
import { EventService } from '@sunbird-cb/utils'
import { LoaderService } from '../../home/services/loader.service'
import { DomSanitizer } from '@angular/platform-browser'
import { UsersService } from '../../home/services/users.service'
import { TelemetryEvents } from '../../home/routes/events/model/telemetry.event.model'

describe('MentorManageComponent', () => {
  let component: MentorManageComponent
  let fixture: ComponentFixture<MentorManageComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MentorManageComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorManageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
