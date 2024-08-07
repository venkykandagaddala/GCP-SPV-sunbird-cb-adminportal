import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import * as _ from 'lodash'

@Component({
  selector: 'ws-app-provider-details',
  templateUrl: './provider-details.component.html',
  styleUrls: ['./provider-details.component.scss'],
})
export class ProviderDetailsComponent implements OnInit {

  providerFormGroup!: FormGroup

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.initialization()
  }

  ngOnInit() {
    // this.initialization()
  }

  initialization() {
    this.providerFormGroup = this.formBuilder.group({
      partnerName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.\-_$/:\[\] ' !]*$/), Validators.maxLength(70)]),
      url: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.\-_$/:\[\] ' !]*$/), Validators.maxLength(70)]),
      description: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.\-_$/:\[\] ' !]*$/), Validators.maxLength(600)]),
    })
  }

  getTextLength(controlName: string) {
    return _.get(this.providerFormGroup.get(controlName), 'value!.length', 0)
  }

}
