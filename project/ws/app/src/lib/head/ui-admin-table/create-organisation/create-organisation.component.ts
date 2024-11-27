import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar'
import * as _ from 'lodash'
import { CreateMDOService } from '../../../routes/home/services/create-mdo.services'
import { ActivatedRoute } from '@angular/router'
import { LoaderService } from '../../../routes/home/services/loader.service'
@Component({
  selector: 'ws-app-create-organisation',
  templateUrl: './create-organisation.component.html',
  styleUrls: ['./create-organisation.component.scss']
})
export class CreateOrganisationComponent implements OnInit, OnDestroy {

  //#region (global variables)

  //#region (input and output)
  @Input() rowData: any
  @Input() dropdownList: {
    statesList: any[],
    ministriesList: any[]
  } = {
      statesList: [],
      ministriesList: [],
    }
  @Input() openMode: string = ''
  @Output() buttonClick = new EventEmitter()
  @Output() organizationCreated = new EventEmitter<any>()
  //#endregion

  organisationForm!: FormGroup
  statesList: any = []
  ministriesList: any = []
  selectedLogo: any
  selectedLogoName = ''
  validFileTypes = ['image/png', 'image/jpeg', 'image/jpg']
  maxFileSize = 500  // In KB
  loggedInUserId = ""
  isLoading = false
  filteredStates: any[] = []
  filteredMinistry: any[] = []
  heirarchyObject: any
  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private createMDOService: CreateMDOService,
    private activatedRoute: ActivatedRoute,
    private loaderService: LoaderService
  ) {

    this.addOverflowHidden()
  }

  //#region (ng onint)
  ngOnInit(): void {
    this.loggedInUserId = _.get(this.activatedRoute, 'snapshot.parent.data.configService.userProfile.userId')
    this.initialization()
    if (this.openMode === 'editMode') {
      this.getOrganization(this.rowData.organisation, this.rowData.type.toLowerCase())
    }
  }

  ngOnDestroy(): void {
    this.removeOverflowHidden()
  }

  initialization() {
    console.log(this.rowData)

    if (this.dropdownList) {
      this.statesList = _.get(this.dropdownList, 'statesList', [])
      this.filteredStates = [...this.statesList]

      this.ministriesList = _.get(this.dropdownList, 'ministriesList', [])
      this.filteredMinistry = [...this.ministriesList]
    }

    this.organisationForm = this.formBuilder.group({
      organisationName: new FormControl(_.get(this.rowData, 'organisation', ''), [Validators.required]),
      category: new FormControl(_.get(this.rowData, 'type', ''), [Validators.required]),
      state: new FormControl(_.get(this.rowData, 'state', '')),
      ministry: new FormControl(_.get(this.rowData, 'ministry', '')),
      description: new FormControl(_.get(this.rowData, 'description', ''), [Validators.required, Validators.maxLength(1000)])
    })

    this.selectedLogo = this.rowData?.logo
    this.valueChangeEvents()
  }

  get controls() {
    return this.organisationForm.controls
  }

  displayFn(option: any): string {
    return option ? option.orgName : ''
  }

  filterStates(value: string): void {
    const filterValue = value.toLowerCase()
    this.filteredStates = this.statesList.filter((option: any) =>
      option.orgName.toLowerCase().includes(filterValue)
    )
  }

  filterMinistry(value: string): void {
    const filterValue = value.toLowerCase()
    this.filteredMinistry = this.ministriesList.filter((option: any) =>
      option.orgName.toLowerCase().includes(filterValue)
    )
  }

  valueChangeEvents() {
    if (this.organisationForm && this.organisationForm.controls.category) {
      this.organisationForm.controls.category.valueChanges.subscribe(val => {
        if (val === 'state') {
          this.organisationForm.controls.state.setValidators([Validators.required])
          this.organisationForm.controls.state.updateValueAndValidity()
          this.organisationForm.controls.ministry.setValue('')
          this.organisationForm.controls.ministry.clearValidators()
          this.organisationForm.controls.ministry.updateValueAndValidity()
        } else if (val === 'ministry') {
          this.organisationForm.controls.ministry.setValidators([Validators.required])
          this.organisationForm.controls.ministry.updateValueAndValidity()
          this.organisationForm.controls.state.setValue('')
          this.organisationForm.controls.state.clearValidators()
          this.organisationForm.controls.state.updateValueAndValidity()
        }
      })
    }
  }
  //#endregion

  //#region (UI interaction lick click)

  get getCategory() {
    return this.organisationForm.controls.category.value
  }

  closeNaveBar() {
    const event = {
      action: 'close'
    }
    this.buttonClick?.emit(event)
  }

  onSubmitCreateOrganization() {
    const payload = {
      orgName: this.controls['organisationName'].value,
      channel: this.controls['organisationName'].value,
      organisationType: this.heirarchyObject?.sbOrgType || "",
      organisationSubType: this.heirarchyObject?.sbOrgSubType || "",
      isTenant: true,
      requestedBy: this.loggedInUserId,

      logo: this.selectedLogo,
      description: this.controls['description'].value,
      parentMapId: this.heirarchyObject?.parentMapId || "",
      sbRootOrgId: this.heirarchyObject?.sbRootOrgId || "",
    }

    if (this.openMode === 'editMode') {
      this.updateOrganization(payload)
    } else {
      this.createOrganization(payload)
    }
  }

  private createOrganization(payload: any): void {
    this.loaderService.changeLoad.next(true)
    this.isLoading = true
    this.createMDOService.createOrganization(payload).subscribe({
      next: (response: any) => {
        if (response.result) {
          this.organizationCreated.emit(payload)
          this.snackBar.open('Organization successfully created.', 'Close', { panelClass: ['success'] })
          this.closeNaveBar()
          this.loaderService.changeLoad.next(false)
          this.isLoading = false
        }
      },
      error: () => {
        this.loaderService.changeLoad.next(false)
        this.isLoading = false
      }
    })
  }
  private updateOrganization(request: any): void {
    this.loaderService.changeLoad.next(true)
    this.isLoading = true
    const payload = {
      orgName: request.orgName,
      channel: request.channel,
      organisationSubType: this.heirarchyObject.sbOrgSubType,
      orgId: this.rowData.id,
      logo: request.logo,
      description: request.description
    }

    this.createMDOService.updateOrganization(payload).subscribe({
      next: (response: any) => {
        if (response.result) {
          this.organizationCreated.emit(payload)
          this.snackBar.open('Organization successfully updated.', 'Close', { panelClass: ['success'] })
          this.closeNaveBar()
          this.loaderService.changeLoad.next(false)
          this.isLoading = false
        }
      },
      error: (error: any) => {
        console.error(error)
        this.loaderService.changeLoad.next(false)
        this.isLoading = false
      }
    })
  }

  uploadLogo(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files?.length) {
      const selectedFile = input.files[0]
      this.selectedLogoName = selectedFile.name
      const maxFileSize = this.maxFileSize * 1024

      if (!this.validFileTypes.includes(selectedFile.type)) {
        this.snackBar.open('Invalid file type', 'Close', { panelClass: ['error'] })
        return
      }

      if (selectedFile.size > maxFileSize) {
        this.snackBar.open(`File size exceeds ${this.maxFileSize} KB. Please select a smaller file.`, 'Close', { panelClass: ['error'] })
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        this.selectedLogo = reader.result
      }
      reader.readAsDataURL(selectedFile)
    }
  }
  //#endregion

  addOverflowHidden() {
    document.body.classList.add('overflow-hidden')
  }

  removeOverflowHidden() {
    document.body.classList.remove('overflow-hidden')
  }

  getOrganization(orgName: string, type: string) {
    this.createMDOService.searchOrgs(orgName, type).subscribe({
      next: (response: any) => {
        const organization = response.result.response.find(
          (org: any) => org.orgName === orgName
        )
        if (organization) {
          this.heirarchyObject = organization
        }
      },
    })
  }

  onSelectStateMinistry(org: any) {
    this.getOrganization(org.orgName, this.controls['category'].value)

  }

}
