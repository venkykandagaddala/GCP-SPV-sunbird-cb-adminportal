
import { MarketplaceService } from '../../services/marketplace.service'
import { Router } from '@angular/router'
import { CoursesPreviewComponent } from './courses-preview.component'
describe('CoursesPreviewComponent', () => {
    let component: CoursesPreviewComponent

    const marketPlaceSvc: Partial<MarketplaceService> = {}
    const router: Partial<Router> = {
        navigate: jest.fn()
    }

    beforeAll(() => {
        component = new CoursesPreviewComponent(
            marketPlaceSvc as MarketplaceService,
            router as Router
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