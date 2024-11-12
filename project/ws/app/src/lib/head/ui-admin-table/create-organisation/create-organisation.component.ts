import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import * as _ from 'lodash'

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
  //#endregion

  organisationForm!: FormGroup
  statesList: any = []
  ministriesList: any = []

  //#endregion

  constructor(
    private formBuilder: FormBuilder
  ) {

    this.addOverflowHidden()
  }

  //#region (ng onint)
  ngOnInit(): void {
    this.initialization()
  }

  ngOnDestroy(): void {
    this.removeOverflowHidden()
  }

  initialization() {
    this.organisationForm = this.formBuilder.group({
      organisationName: new FormControl(_.get(this.rowData, 'organisationName', ''), [Validators.required]),
      category: new FormControl(_.get(this.rowData, 'category', ''), [Validators.required]),
      state: new FormControl(_.get(this.rowData, 'state', '')),
      minsitry: new FormControl(_.get(this.rowData, 'minsitry', '')),
      description: new FormControl(_.get(this.rowData, 'description', ''), [Validators.required, Validators.minLength(200)])
    })

    if (this.dropdownList) {
      this.statesList = _.get(this.dropdownList, 'statesList', [])
      this.ministriesList = _.get(this.dropdownList, 'ministriesList', [])
    }

    this.valueChangeEvents()
  }

  valueChangeEvents() {
    if (this.organisationForm && this.organisationForm.controls.category) {
      this.organisationForm.controls.category.valueChanges.subscribe(val => {
        if (val === 'state') {
          this.organisationForm.controls.state.setValidators([Validators.required])
          this.organisationForm.controls.state.updateValueAndValidity()
          this.organisationForm.controls.minsitry.setValue('')
          this.organisationForm.controls.minsitry.clearValidators()
          this.organisationForm.controls.minsitry.updateValueAndValidity()
        } else if (val === 'center') {
          this.organisationForm.controls.minsitry.setValidators([Validators.required])
          this.organisationForm.controls.minsitry.updateValueAndValidity()
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

  get cansubmit(): boolean {
    let formValid = false
    if (this.openMode === 'editMode' && this.organisationForm.valid) {
      formValid = true
    }
    if (this.openMode === 'createNew' && this.organisationForm.valid) {
      formValid = true
    }
    return formValid
  }

  submit() { }

  uploadLogo(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files?.length) {
      const selectedFile = input.files[0]
      const validFileTypes = ['image/png', 'image/jpeg', 'image/jpg']

      const isFileTypeValid = validFileTypes.includes(selectedFile.type)

      if (isFileTypeValid) {
        console.log(selectedFile)
      } else {
        console.log('Invalid file')

      }
    }

  }
  //#endregion

  addOverflowHidden() {
    document.body.classList.add('overflow-hidden')
  }

  removeOverflowHidden() {
    document.body.classList.remove('overflow-hidden')
  }

}
