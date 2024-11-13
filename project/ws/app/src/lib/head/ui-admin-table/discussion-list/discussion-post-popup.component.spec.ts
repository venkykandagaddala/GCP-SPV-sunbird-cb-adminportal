import { MatDialogRef } from '@angular/material/dialog'
import { FormBuilder } from '@angular/forms'
import { DialogTextProfanityComponent, IDialogData } from './discussion-post-popup.component'

describe('DialogTextProfanityComponent', () => {
    let component: DialogTextProfanityComponent

    const fb: Partial<FormBuilder> = {
        group: jest.fn(),
    }
    const dialogRef: Partial<MatDialogRef<DialogTextProfanityComponent>> = {}
    const data: Partial<IDialogData> = {
        profaneCategories: [],
    }

    beforeAll(() => {
        component = new DialogTextProfanityComponent(
            fb as FormBuilder,
            dialogRef as MatDialogRef<DialogTextProfanityComponent>,
            data as IDialogData
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
