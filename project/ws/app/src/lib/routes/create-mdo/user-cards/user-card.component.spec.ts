import { ChangeDetectorRef } from '@angular/core'
import { UsersService } from '../../../routes/home/services/users.service'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { RolesService } from '../../../routes/home/services/roles.service'
import { ActivatedRoute } from '@angular/router'
import { UserCardComponent } from './user-card.component'
import { of } from 'rxjs'
import { EventService } from '@sunbird-cb/utils'
// import { FormControl, FormGroup } from '@angular/forms'

describe('UserCardComponent', () => {
    let component: UserCardComponent

    const usersSvc: Partial<UsersService> = {
        getUserById: jest.fn().mockReturnValue(of({ profileDetails: { personalDetails: { firstname: 'Test User' } } })),
    }

    const roleservice: Partial<RolesService> = {
        getAllRoles: jest.fn(() => of({
            result: {
                response: {
                    value: JSON.stringify({ orgTypeList: ['Type1', 'Type2'] }),
                },
            },
        })),
    }

    const dialog: Partial<MatDialog> = {}
    const route: Partial<ActivatedRoute> = {
        snapshot: {
            params: { tab: 'verified' },
            queryParams: of({ roleId: 'testRoleId' }),
            data: {
                configSvc: {
                    userProfile: {
                        userId: 'sampleId',
                    },
                },
            },
            parent: {
                url: [], // Mock the URL as an empty array
                params: {}, // Empty object for params
                queryParams: {}, // Empty object for queryParams
                fragment: null, // No fragment
                data: {
                    configService: {
                        userRoles: new Map([['spv_admin', true]]), // Mock the userRoles map
                    },
                },
            } as any,
        } as any,
    }


    const snackBar: Partial<MatSnackBar> = {}
    const events: Partial<EventService> = {}
    const cdr: Partial<ChangeDetectorRef> = {
        detectChanges: jest.fn(),
    }

    beforeEach(() => {
        jest.clearAllMocks()
        component = new UserCardComponent(
            usersSvc as UsersService,
            roleservice as unknown as RolesService,
            dialog as MatDialog,
            route as ActivatedRoute,
            snackBar as MatSnackBar,
            events as EventService,
            cdr as ChangeDetectorRef
        )
        component.usersData = [{ userId: '123', enableEdit: false }]
    })

    it('should create an instance of the component', () => {
        expect(component).toBeTruthy()
    })

    // describe('onEditUser', () => {
    //     it('should call getUserById and set user details', () => {
    //         // Arrange
    //         const user = {
    //             userId: '123'
    //         }
    //         const panel = { open: jest.fn() }
    //         const userResponse = {
    //             profileDetails: {
    //                 additionalProperties: { externalSystemId: 'EHRMS123' },
    //                 professionalDetails: [{ designation: 'Developer', group: 'Dev' }],
    //                 personalDetails: {
    //                     primaryEmail: 'test@example.com',
    //                     mobile: '1234567890',
    //                     gender: 'MALE',
    //                     dob: '1990-01-01',
    //                     domicileMedium: 'English',
    //                     category: 'General',
    //                 },
    //                 employmentDetails: { pinCode: '123456', employeeCode: 'EMP001' }
    //             }
    //         }

    //         // Mocking getUserById service
    //         usersSvc.getUserById = jest.fn().mockReturnValue(of(userResponse))

    //         // Mocking the form group and controls
    //         component.updateUserDataForm = new FormGroup({
    //             ehrmsID: new FormControl(),
    //             designation: new FormControl(),
    //             group: new FormControl(),
    //             primaryEmail: new FormControl(),
    //             mobile: new FormControl(),
    //             gender: new FormControl(),
    //             dob: new FormControl(),
    //             domicileMedium: new FormControl(),
    //             category: new FormControl(),
    //             pincode: new FormControl(),
    //             employeeID: new FormControl(),
    //         })

    //         // Spying on form control methods
    //         jest.spyOn(component.updateUserDataForm, 'reset')
    //         jest.spyOn(component.updateUserDataForm.controls['ehrmsID'], 'setValue')
    //         jest.spyOn(component.updateUserDataForm.controls['designation'], 'setValue')
    //         jest.spyOn(component.updateUserDataForm.controls['group'], 'setValue')
    //         jest.spyOn(component.updateUserDataForm.controls['primaryEmail'], 'setValue')
    //         jest.spyOn(component.updateUserDataForm.controls['mobile'], 'setValue')
    //         jest.spyOn(component.updateUserDataForm.controls['gender'], 'setValue')
    //         jest.spyOn(component.updateUserDataForm.controls['dob'], 'patchValue')
    //         jest.spyOn(component.updateUserDataForm.controls['domicileMedium'], 'setValue')
    //         jest.spyOn(component.updateUserDataForm.controls['category'], 'setValue')
    //         jest.spyOn(component.updateUserDataForm.controls['pincode'], 'setValue')
    //         jest.spyOn(component.updateUserDataForm.controls['employeeID'], 'setValue')

    //         // Act
    //         component.onEditUser(user, panel)

    //         // Assert
    //         expect(usersSvc.getUserById).toHaveBeenCalledWith(user.userId)
    //         expect(panel.open).toHaveBeenCalled()
    //         expect(component.updateUserDataForm.reset).toHaveBeenCalled()
    //         expect(component.updateUserDataForm.controls['ehrmsID'].setValue).toHaveBeenCalledWith('EHRMS123')
    //         expect(component.updateUserDataForm.controls['designation'].setValue).toHaveBeenCalledWith('Developer')
    //         expect(component.updateUserDataForm.controls['group'].setValue).toHaveBeenCalledWith('Dev')
    //         expect(component.updateUserDataForm.controls['primaryEmail'].setValue).toHaveBeenCalledWith('test@example.com')
    //         expect(component.updateUserDataForm.controls['mobile'].setValue).toHaveBeenCalledWith('1234567890')
    //         expect(component.updateUserDataForm.controls['gender'].setValue).toHaveBeenCalledWith('Male')
    //         expect(component.updateUserDataForm.controls['dob'].patchValue).toHaveBeenCalledWith({
    //             dob: new Date('1990-01-01'),
    //         })
    //         expect(component.updateUserDataForm.controls['domicileMedium'].setValue).toHaveBeenCalledWith('English')
    //         expect(component.updateUserDataForm.controls['category'].setValue).toHaveBeenCalledWith('General')
    //         expect(component.updateUserDataForm.controls['pincode'].setValue).toHaveBeenCalledWith('123456')
    //         expect(component.updateUserDataForm.controls['employeeID'].setValue).toHaveBeenCalledWith('EMP001')
    //     })

    //     it('should set enableEdit to false for other users', () => {
    //         // Arrange
    //         const user = { userId: '123' }
    //         const panel = { open: jest.fn() }
    //         const otherUser = { userId: '456' }
    //         component.usersData.push(otherUser)

    //         const userResponse = {
    //             profileDetails: {
    //                 personalDetails: { firstname: 'Test User' }
    //             }
    //         }

    //         // Mocking getUserById service
    //         usersSvc.getUserById = jest.fn().mockReturnValue(of(userResponse))

    //         // Act
    //         component.onEditUser(user, panel)

    //         // Assert
    //         expect(component.usersData[0].enableEdit).toBe(true)
    //         expect(component.usersData[1].enableEdit).toBe(false)
    //     })
    // })

    // describe('setUserDetails', () => {
    //     it('should correctly set values in the form based on user details', () => {
    //         // Arrange
    //         const user = {
    //             profileDetails: {
    //                 additionalProperties: { externalSystemId: 'EHRMS123' },
    //                 professionalDetails: [{ designation: 'Developer', group: 'Dev' }],
    //                 personalDetails: {
    //                     primaryEmail: 'test@example.com',
    //                     mobile: '1234567890',
    //                     gender: 'MALE',
    //                     dob: '1990-01-01',
    //                     domicileMedium: 'English',
    //                     category: 'General',
    //                 },
    //                 employmentDetails: { pinCode: '123456', employeeCode: 'EMP001' }
    //             }
    //         }

    //         // Act
    //         component.setUserDetails(user)

    //         // Assert
    //         // expect(component.updateUserDataForm.reset).toHaveBeenCalled()
    //         // expect(component.updateUserDataForm.controls['ehrmsID'].setValue).toHaveBeenCalledWith('EHRMS123')
    //         // expect(component.updateUserDataForm.controls['designation'].setValue).toHaveBeenCalledWith('Developer')
    //         // expect(component.updateUserDataForm.controls['group'].setValue).toHaveBeenCalledWith('Dev')
    //         // expect(component.updateUserDataForm.controls['primaryEmail'].setValue).toHaveBeenCalledWith('test@example.com')
    //         // expect(component.updateUserDataForm.controls['mobile'].setValue).toHaveBeenCalledWith('1234567890')
    //         // expect(component.updateUserDataForm.controls['gender'].setValue).toHaveBeenCalledWith('Male')
    //         // expect(component.updateUserDataForm.patchValue).toHaveBeenCalledWith({
    //         //     dob: new Date('1990-01-01'),
    //         // })
    //         // expect(component.updateUserDataForm.controls['domicileMedium'].setValue).toHaveBeenCalledWith('English')
    //         // expect(component.updateUserDataForm.controls['category'].setValue).toHaveBeenCalledWith('General')
    //         // expect(component.updateUserDataForm.controls['pincode'].setValue).toHaveBeenCalledWith('123456')
    //         // expect(component.updateUserDataForm.controls['employeeID'].setValue).toHaveBeenCalledWith('EMP001')
    //     })

    //     // it('should handle missing profileDetails gracefully', () => {
    //     //     // Arrange
    //     //     const user = {}

    //     //     // Act
    //     //     component.setUserDetails(user)

    //     //     // Assert
    //     //     expect(component.updateUserDataForm.reset).toHaveBeenCalled()
    //     // })
    // })

    // describe('ngOnInit', () => {
    //     it('should call init method on ngOnInit', async () => {
    //         jest.spyOn(component, 'init')

    //         component.ngOnInit()

    //         expect(component.init).toHaveBeenCalled()
    //         expect(roleservice.getAllRoles).toHaveBeenCalled()
    //     })
    // })

    // describe('enableUpdateButton', () => {
    //     it('should return true if no fields are invalid', () => {
    //         const result = component.enableUpdateButton({ needApprovalList: [{ label: 'Group' }, { label: 'Designation' }] })
    //         expect(result).toBe(true)
    //     })

    //     it('should return true if Group field is invalid', () => {

    //         const result = component.enableUpdateButton({ needApprovalList: [{ label: 'Group' }] })
    //         expect(result).toBe(true)
    //     })

    //     it('should return true if Designation field is invalid', () => {

    //         const result = component.enableUpdateButton({ needApprovalList: [{ label: 'Designation' }] })
    //         expect(result).toBe(true)
    //     })
    // })

    // describe('ngOnChanges', () => {
    //     it('should order usersData by firstName if present', () => {
    //         component.usersData = [
    //             { profileDetails: { personalDetails: { firstname: 'John' } } },
    //             { firstName: 'John' },
    //         ]

    //         component.ngOnChanges()

    //         expect(component.usersData[0].profileDetails.personalDetails.firstname).toBe('John')
    //         expect(component.usersData[1].firstName).toBe('John')
    //     })

    //     it('should order usersData by firstName if firstname is absent', () => {
    //         component.usersData = [
    //             { firstName: 'Charlie' },
    //             { profileDetails: { personalDetails: { firstname: 'Bob' } } },
    //         ]

    //         component.ngOnChanges()

    //         expect(component.usersData[1].firstName).toBe('Charlie')
    //     })
    // })

    // describe('ngAfterViewChecked', () => {
    //     it('should call detectChanges', () => {
    //         component.ngAfterViewChecked()
    //         expect(cdr.detectChanges).toHaveBeenCalled()
    //     })
    // })

    // describe('getUserMappedData', () => {
    //     it('should set user data and enableToggle for transfers', async () => {
    //         const approvalData = [
    //             { userWorkflow: { userInfo: { wid: '123' } }, needApprovalList: [] },
    //         ]

    //         await component.getUserMappedData(approvalData)

    //         expect(usersSvc.getUserById).toHaveBeenCalledWith('123')

    //     })

    //     it('should set noneedApprovalList based on needApprovalList', async () => {
    //         const approvalData = [
    //             {
    //                 userWorkflow: { userInfo: { wid: '123' } },
    //                 needApprovalList: [{ feildName: 'group' }],
    //                 user: { profileDetails: { professionalDetails: [{ designation: 'Engineer', group: 'Dev' }] } }
    //             },
    //         ]
    //         await component.getUserMappedData(approvalData)
    //     })
    // })

    // describe('onEditUser', () => {
    //     it('should call the api', () => {
    //         //arrange
    //         // usersSvc.getUserById = jest.fn()
    //         //act
    //         component.onEditUser('123', 'sample')
    //         //assert
    //         expect(usersSvc.getUserById).toHaveBeenCalled()
    //     })
    // })
})
