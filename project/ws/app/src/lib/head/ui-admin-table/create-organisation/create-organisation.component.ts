import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'ws-app-create-organisation',
  templateUrl: './create-organisation.component.html',
  styleUrls: ['./create-organisation.component.scss']
})
export class CreateOrganisationComponent implements OnInit {

  //#region (global variables)

  //#region (input and output)
  @Input() selectedDepartment = ''
  @Input() rowData: any
  @Input() actions: string = ''
  @Output() buttonClick = new EventEmitter()
  //#endregion

  organisationForm!: FormGroup

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
      organisationName: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      minsitry: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required, Validators.minLength(1000)])
    })
  }
  //#endregion

  //#region (UI interaction lick click)
  closeNaveBar() {
    const event = {
      action: 'close'
    }
    this.buttonClick?.emit(event)
  }

  submit() { }

  //#endregion

}
