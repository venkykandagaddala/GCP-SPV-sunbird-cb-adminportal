import { AfterViewInit, Component, Input, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'ws-app-via-api',
  templateUrl: './via-api.component.html',
  styleUrls: ['./via-api.component.scss']
})
export class ViaApiComponent implements OnInit, AfterViewInit {
  //#region (global varialbles)
  //#region (view chaild, input and output)
  @Input() providerDetails?: any
  //#endregion

  viaApiFormGroup!: FormGroup
  authorizationFormGroup!: FormGroup
  headersFormGroup!: FormGroup
  bodyFormGroup!: FormGroup
  apiTypesList: any[] = []
  //#endregion

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngAfterViewInit(): void {
    console.log('view in it')
  }

  ngOnInit(): void {
    this.initializaTion()
  }

  initializaTion() {
    this.viaApiFormGroup = this.formBuilder.group({
      apiType: new FormControl('', [Validators.required]),
      apiUrl: new FormControl('', Validators.required)
    })

    this.authorizationFormGroup = this.formBuilder.group({
      tableListFormArray: this.formBuilder.array([])
    })

    this.headersFormGroup = this.formBuilder.group({
      tableListFormArray: this.formBuilder.array([])
    })

    this.bodyFormGroup = this.formBuilder.group({
      tableListFormArray: this.formBuilder.array([])
    })

    this.apiTypesList = [
      {
        type: 'Get',
        value: 'get'
      },
      {
        type: 'Post',
        value: 'post'
      },
    ]
  }

  fetchData() {
    console.log('authorization', this.authorizationFormGroup.value)
    console.log('header', this.headersFormGroup.value)
    console.log('body', this.bodyFormGroup.value)
  }

}
