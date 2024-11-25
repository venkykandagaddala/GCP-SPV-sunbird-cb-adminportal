
import { Router } from '@angular/router'
import { ConfigureMarketplaceProvidersComponent } from './configure-marketplace-providers.component'

describe('ConfigureMarketplaceProvidersComponent', () => {
    let component: ConfigureMarketplaceProvidersComponent

    const router: Partial<Router> = {}

    beforeAll(() => {
        component = new ConfigureMarketplaceProvidersComponent(
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
