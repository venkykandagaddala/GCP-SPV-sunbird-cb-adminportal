import { HelpCenterGuideComponent } from './help-center-guide.component'

describe('HelpCenterGuideComponent', () => {
    let component: HelpCenterGuideComponent



    beforeAll(() => {
        component = new HelpCenterGuideComponent(

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