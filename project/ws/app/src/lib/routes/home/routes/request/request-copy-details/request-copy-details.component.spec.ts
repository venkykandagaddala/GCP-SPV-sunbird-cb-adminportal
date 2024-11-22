import { FormBuilder } from '@angular/forms'
import { RequestServiceService } from '../request-service.service'
import { ActivatedRoute, Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { InitService } from '../../../../../../../../../../src/app/services/init.service'
import { RequestCopyDetailsComponent } from './request-copy-details.component'
import { of } from 'rxjs'
describe('RequestCopyDetailsComponent', () => {

    let component: RequestCopyDetailsComponent

    const formBuilder: Partial<FormBuilder> = {
        group: jest.fn().mockReturnValue({}),
    }
    const requestService: Partial<RequestServiceService> = {
    }
    const activatedRouter: Partial<ActivatedRoute> = {

    }
    const snackBar: Partial<MatSnackBar> = {
        open: jest.fn(),
    }
    const router: Partial<Router> = {
        navigate: jest.fn(),
    }
    const dialog: Partial<MatDialog> = {
        open: jest.fn().mockReturnValue({ afterClosed: () => of(true) }),
    }
    const initService: Partial<InitService> = {
    }

    beforeAll(() => {
        component = new RequestCopyDetailsComponent(
            formBuilder as FormBuilder,
            requestService as RequestServiceService,
            activatedRouter as ActivatedRoute,
            snackBar as MatSnackBar,
            router as Router,
            dialog as MatDialog,
            initService as InitService
        )
    })

    beforeEach(() => {
        jest.clearAllMocks()
        jest.resetAllMocks()
    })

    it('should create an instance of the component', () => {
        expect(component).toBeTruthy()
    })
})
