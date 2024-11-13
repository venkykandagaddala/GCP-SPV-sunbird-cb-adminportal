
import { ActivatedRoute, Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import { EventService } from '@sunbird-cb/utils'
import { EventListViewComponent } from './event-list-view.component'


describe('EventListViewComponent', () => {
    let component: EventListViewComponent

    const router: Partial<Router> = {}
    const matDialog: Partial<MatDialog> = {}
    const events: Partial<EventService> = {}
    const route: Partial<ActivatedRoute> = {}
    const cd: Partial<ChangeDetectorRef> = {}
    const content: Partial<IContentShareData> = {}

    beforeAll(() => {
        component = new EventListViewComponent(
            router as Router,
            matDialog as MatDialog,
            events as EventService,
            route as ActivatedRoute,
            cd as ChangeDetectorRef,
            content as IContentShareData
        )
    })

    beforeEach(() => {
        jest.clearAllMocks()
        jest.resetAllMocks()
    })

    it('should create a instance of component', () => {
        expect(component).toBeTruthy()
    })
})