import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MarketplaceService } from '../../services/marketplace.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import * as _ from 'lodash'
import { HttpErrorResponse } from '@angular/common/http'

@Component({
  selector: 'ws-app-via-api',
  templateUrl: './via-api.component.html',
  styleUrls: ['./via-api.component.scss'],
})
export class ViaApiComponent implements OnInit, OnChanges {
  //#region (global varialbles)
  //#region (view chaild, input and output)
  @Input() providerDetails?: any
  @Input() viaApiTabIndex = 0
  @Input() tabIndex = -1

  @Output() loadProviderDetails = new EventEmitter<Boolean>()
  //#endregion

  servicesFormGroup!: FormGroup
  viaApiFormGroup!: FormGroup
  headersFormGroup!: FormGroup
  paramsFormGroup!: FormGroup
  bodyFormGroup!: FormGroup
  apiTypesList: any[] = []
  delayTabLoad = true
  //#endregion

  constructor(
    private formBuilder: FormBuilder,
    private marketPlaceSvc: MarketplaceService,
    private snackBar: MatSnackBar
  ) {
    this.initializaTion()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.viaApiTabIndex && changes.viaApiTabIndex.currentValue === this.tabIndex) {
      this.delayTabLoad = false
    }
    if (changes.providerDetails) {
      this.getCoursesConfiguration()
    }
  }

  getCoursesConfiguration() {
    const contentApisId = _.get(this.providerDetails, 'serviceRegistryDetails.contentApisId', null)
    if (contentApisId) {
      this.marketPlaceSvc.getConfiguraionDetails(contentApisId).subscribe((responce: any) => {
        this.patchFormData(responce)
      })
    }
  }

  patchFormData(configurationDetails: any) {
    const urlSplit = _.get(configurationDetails, 'url').split('?byProgramIds=F3F_2DjnR0Wxf9g45zdFsg')
    const headerMap = _.get(configurationDetails, 'requestPayload.headerMap')
    const urlMap = _.get(configurationDetails, 'requestPayload.urlMap')
    const requestMap = _.get(configurationDetails, 'requestPayload.requestMap')
    this.servicesFormGroup.setValue({
      serviceName: _.get(configurationDetails, 'serviceName'),
      serviceCode: _.get(configurationDetails, 'serviceCode'),
      serviceDescription: _.get(configurationDetails, 'serviceDescription'),
    })
    this.servicesFormGroup.controls.serviceCode.disable()
    this.viaApiFormGroup.setValue({
      apiType: _.get(configurationDetails, 'requestMethod'),
      apiUrl: urlSplit[0],
    })

    if (headerMap) {
      this.pushObjectToFormArray(this.headersFormGroup.controls.tableListFormArray as FormArray, headerMap)
    }

    if (urlMap) {
      this.pushObjectToFormArray(this.paramsFormGroup.controls.tableListFormArray as FormArray, urlMap)
    }

    if (requestMap) {
      if (configurationDetails.isFormData) {
        this.bodyFormGroup.controls.bodyType.patchValue('urlencoded')
        this.pushObjectToFormArray(this.bodyFormGroup.controls.tableListFormArray as FormArray, requestMap)
      } else {
        this.bodyFormGroup.controls.bodyType.patchValue('raw')
        this.bodyFormGroup.controls.rawData.patchValue(requestMap)
      }
    }

  }

  pushObjectToFormArray(formArray: FormArray, object: any) {
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        const formGroup = this.formBuilder.group({
          key: new FormControl(key),
          value: new FormControl(object[key]),
        })
        formArray.insert(formArray.length - 1, formGroup)
      }
    }
  }

  ngOnInit(): void {
  }

  initializaTion() {
    this.servicesFormGroup = this.formBuilder.group({
      serviceName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.\-_$/:\[\] ' !]*$/)]),
      serviceCode: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.\-_$/:\[\] ' !]*$/)]),
      serviceDescription: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.\-_$/:\[\] ' !]*$/)]),
    })

    this.viaApiFormGroup = this.formBuilder.group({
      apiType: new FormControl('', [Validators.required]),
      apiUrl: new FormControl('', Validators.required),
    })

    this.paramsFormGroup = this.formBuilder.group({
      tableListFormArray: this.formBuilder.array([]),
    })

    this.headersFormGroup = this.formBuilder.group({
      tableListFormArray: this.formBuilder.array([]),
    })

    this.bodyFormGroup = this.formBuilder.group({
      tableListFormArray: this.formBuilder.array([]),
      bodyType: new FormControl('urlencoded'),
      rawData: new FormControl(''),
    })

    this.apiTypesList = [
      {
        type: 'Get',
        value: 'GET',
      },
      {
        type: 'Post',
        value: 'POST',
      },
    ]
  }

  getControlValidation(controlName: string, validator: string): Boolean {
    const control = this.servicesFormGroup.get(controlName)
    if (control && control.errors && control.errors[validator]) {
      return true
    }
    return false
  }

  getTextLength(controlName: string) {
    return _.get(this.servicesFormGroup.get(controlName), 'value.length', 0)
  }

  configure() {
    if (this.servicesFormGroup.valid && this.viaApiFormGroup.valid) {
      const formBody: any = this.generatCoursesConfiguration()
      if (_.get(this.providerDetails, 'serviceRegistryDetails.contentApisId', null)) {
        formBody['id'] = _.get(this.providerDetails, 'serviceRegistryDetails.contentApisId')
        this.marketPlaceSvc.updateConfiguration(formBody).subscribe({
          next: responce => {
            if (responce) {
              const message = 'Courses get api configuration updated successfully'
              this.showSnackBar(message)
            }
          },
          error: (error: HttpErrorResponse) => {
            const errmsg = _.get(error, 'message', 'Some thing went wrong please try again')
            this.showSnackBar(errmsg)
          },
        })
      } else {
        this.marketPlaceSvc.createConfiguration(formBody).subscribe({
          next: (responce: any) => {
            if (responce) {
              if (this.providerDetails['serviceRegistryDetails']) {
                this.providerDetails['serviceRegistryDetails']['contentApisId'] = responce.id
              } else {
                this.providerDetails['serviceRegistryDetails'] = {
                  contentApisId: responce.id,
                }
              }
              this.updateProviderDetails()
            }
          },
          error: (error: HttpErrorResponse) => {
            const errmsg = _.get(error, 'message', 'Some thing went wrong please try again')
            this.showSnackBar(errmsg)
          },
        })
      }
    } else {
      this.servicesFormGroup.markAllAsTouched()
      this.viaApiFormGroup.markAllAsTouched()
    }
  }

  generatCoursesConfiguration() {
    const serviceDetails = this.servicesFormGroup.value
    serviceDetails['serviceCode'] = this.servicesFormGroup.controls.serviceCode.value.toUpperCase()
    const params = this.getParamsAndUrl()
    const isFormData = this.bodyFormGroup.value.tableListFormArray[0].key ? true : false
    const formBody = {
      isFormData,
      requestMethod: this.viaApiFormGroup.controls.apiType.value,
      url: params.url,
      serviceCode: serviceDetails.serviceCode,
      serviceName: serviceDetails.serviceName,
      serviceDescription: serviceDetails.serviceDescription,
      operationType: 'PEER_TO_PEER',
      urlPlaceholder: params.urlPlaceholder,
      isActive: true,
      isSecureHeader: true,
      urlSegment: null,
      hostAddress: null,
      requestPayload: {
        requestMap: isFormData ? this.generateObjectFromForm(this.bodyFormGroup.value.tableListFormArray) : this.bodyFormGroup.value.rawData,
        headerMap: this.generateObjectFromForm(this.headersFormGroup.value.tableListFormArray),
        urlMap: this.generateObjectFromForm(this.paramsFormGroup.value.tableListFormArray),
        partnerCode: _.get(this.providerDetails, 'data.partnerCode'),
        serviceCode: serviceDetails.serviceCode,
        strictCache: false, // need to work on
        strictCacheTimeInMinutes: 0, // need to work on
      },
    }
    return formBody
  }

  getParamsAndUrl() {
    const parmsAndUrl = {
      url: `${this.viaApiFormGroup.controls.apiUrl.value}?byProgramIds=F3F_2DjnR0Wxf9g45zdFsg`,
      urlPlaceholder: '',
    }
    const params = this.paramsFormGroup.value.tableListFormArray
    if (params && params[0].key) {
      params.forEach((element: any) => {
        if (element.key) {
          parmsAndUrl.url = `${parmsAndUrl.url}&${element['key']}={${element['value']}}`
          parmsAndUrl.urlPlaceholder =
            `${parmsAndUrl.urlPlaceholder}${parmsAndUrl.urlPlaceholder.length === 0 ? '{' : ',{'}${element['value']}}`
        }
      })
    }
    return parmsAndUrl
  }

  generateObjectFromForm(form: any) {
    const generatedObject: any = {}
    if (form && form[0] && form[0].key) {
      form.forEach((element: any) => {
        if (element.key) {
          generatedObject[element.key] = element.value
        }
      })
    }
    return generatedObject
  }

  updateProviderDetails() {
    this.marketPlaceSvc.updateProvider(this.providerDetails).subscribe({
      next: (responce: any) => {
        if (responce) {
          setTimeout(() => {
            const successMsg = 'Courses get api configured successfully'
            this.showSnackBar(successMsg)
            this.loadProviderDetails.emit(true)
          },         1000)
        }
      },
      error: (error: HttpErrorResponse) => {
        const errmsg = _.get(error, 'error.params.errMsg', 'Something went worng, please try again later')
        this.showSnackBar(errmsg)
      },
    })
  }

  showSnackBar(message: string) {
    this.snackBar.open(message)
  }

}
