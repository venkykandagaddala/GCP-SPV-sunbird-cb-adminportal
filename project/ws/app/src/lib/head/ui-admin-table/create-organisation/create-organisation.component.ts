import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import * as _ from 'lodash'

@Component({
  selector: 'ws-app-create-organisation',
  templateUrl: './create-organisation.component.html',
  styleUrls: ['./create-organisation.component.scss']
})
export class CreateOrganisationComponent implements OnInit {

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
  ) { }

  //#region (ng onint)
  ngOnInit(): void {
    this.initialization()
  }

  initialization() {
    this.organisationForm = this.formBuilder.group({
      organisationName: new FormControl(_.get(this.rowData, 'organisationName', ''), [Validators.required]),
      category: new FormControl(_.get(this.rowData, 'category', ''), [Validators.required]),
      state: new FormControl(_.get(this.rowData, 'state', '')),
      minsitry: new FormControl(_.get(this.rowData, 'minsitry', '')),
      description: new FormControl(_.get(this.rowData, 'description', ''), [Validators.required, Validators.minLength(1000)])
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

  //#endregion

}
