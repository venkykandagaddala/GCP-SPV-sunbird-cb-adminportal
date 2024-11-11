
import { ProvidersComponent } from './providers.component'

describe('ProvidersComponent', () => {
    let component: ProvidersComponent



    beforeAll(() => {
        component = new ProvidersComponent(

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