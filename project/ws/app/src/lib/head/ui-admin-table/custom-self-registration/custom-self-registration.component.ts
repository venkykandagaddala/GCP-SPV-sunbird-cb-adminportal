import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'ws-app-custom-self-registration',
  templateUrl: './custom-self-registration.component.html',
  styleUrls: ['./custom-self-registration.component.scss']
})
export class CustomSelfRegistrationComponent implements OnInit, OnDestroy {

  @Output() buttonClick = new EventEmitter()
  @Input() initialData: any = null

  selfRegistrationForm!: FormGroup

  constructor(private formBuilder: FormBuilder) {

    this.addOverflowHidden()
  }

  ngOnInit(): void {
    console.log(this.initialData)
    this.initializeForm()
  }

  ngOnDestroy(): void {
    this.removeOverflowHidden()
  }

  initializeForm(): void {
    this.selfRegistrationForm = this.formBuilder.group({
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    })
  }

  closeNaveBar() {
    const event = {
      action: 'close'
    }
    this.buttonClick?.emit(event)
  }

  generateQRCodeLink() {
    this.initialData.QRGenerated = true
    console.log(this.initialData)

  }

  addOverflowHidden() {
    document.body.classList.add('overflow-hidden')
  }

  removeOverflowHidden() {
    document.body.classList.remove('overflow-hidden')
  }

}
