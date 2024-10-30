import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import * as _ from 'lodash'
import { MarketplaceService } from '../../services/marketplace.service'
import { HttpErrorResponse } from '@angular/common/http'
import { DatePipe } from '@angular/common'
import { forkJoin, of } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import { JsonEditorOptions } from 'ang-jsoneditor'
import { MatSnackBar } from '@angular/material/snack-bar'
import { LoaderService } from '../../../../services/loader.service'
import { environment } from '../../../../../../../../../../../src/environments/environment'

@Component({
  selector: 'ws-app-provider-details',
  templateUrl: './provider-details.component.html',
  styleUrls: ['./provider-details.component.scss'],
})
export class ProviderDetailsComponent implements OnInit, OnChanges {
  @ViewChild('thumbNailInput', { static: false }) thumbNailInput!: ElementRef<HTMLInputElement>
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>
  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>

  @Input() providerDetails?: any

  helpCenterGuide = {
    header: 'Provider Details: Video Guides and Tips',
    guideNotes: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec suscipit orci in ultricies aliquam. Maecenas tempus fermentum mi, at laoreet elit ultricies eget.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec suscipit orci in ultricies aliquam. Maecenas tempus fermentum mi, at laoreet elit ultricies eget.',
    ],
    helpVideoLink: 'url',
  }
  providerFormGroup!: FormGroup
  providerDetalsBeforUpdate: any

  imageUrl!: string
  thumbnailFile: any
  FILE_UPLOAD_MAX_SIZE = 100 * 1024 * 1024
  pdfUploaded = false
  pdfFile: any
  thumbNailUrl = ''
  uploadedPdfUrl = ''
  fileName = ''
  fileUploadedDate: string | null = ''
  thumbnailResourceId = ''
  pdfResourceId = ''
  providerConfiguration: any
  partnerCode = ''
  transforamtionForm!: FormGroup
  public contentEeditorOptions: JsonEditorOptions | undefined
  public progressEditorOptions: JsonEditorOptions | undefined
  public certificateEditorOptions: JsonEditorOptions | undefined

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private marketPlaceSvc: MarketplaceService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private activateRoute: ActivatedRoute,
    private loaderService: LoaderService,
  ) {
    this.initialization()
    this.setJsonEditorOptions()
  }

  setJsonEditorOptions() {
    this.contentEeditorOptions = this.getEditorOptions
    this.progressEditorOptions = this.getEditorOptions
    this.certificateEditorOptions = this.getEditorOptions
  }

  get getEditorOptions(): JsonEditorOptions {
    const editorOptions = new JsonEditorOptions()
    editorOptions.mode = 'text'
    editorOptions.mainMenuBar = false // Hide the menu bar
    editorOptions.navigationBar = false // Hide the navigation bar
    editorOptions.statusBar = false // Hide the status bar at the bottom
    editorOptions.enableSort = false // Disable sorting
    editorOptions.enableTransform = false // Disable transformation
    return editorOptions
  }

  initialization() {
    this.providerFormGroup = this.formBuilder.group({
      contentPartnerName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.\-_$/:\[\] ' !]*$/), Validators.maxLength(70)]),
      websiteUrl: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.\-_$/:\[\] ' !]*$/), Validators.maxLength(70)]),
      description: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.\-_$/:\[\] ' !]*$/), Validators.maxLength(500)]),
      providerTips: this.formBuilder.array([]),
    })
    this.transforamtionForm = this.formBuilder.group({
      trasformContentJson: new FormControl(''),
      transformProgressJson: new FormControl(''),
      trasformCertificateJson: new FormControl(''),
    })
  }

  ngOnInit() {
    this.getRoutesData()
  }

  getRoutesData() {
    this.activateRoute.data.subscribe(data => {
      if (data.pageData.data) {
        this.providerConfiguration = data.pageData.data
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.providerDetails && changes.providerDetails.currentValue) {
      this.getProviderDetails()
    }
  }

  getProviderDetails() {
    if (this.providerDetails && this.providerDetails.id) {
      this.loaderService.changeLoad.next(true)
      this.marketPlaceSvc.getProviderDetails(this.providerDetails.id).subscribe({
        next: (responce: any) => {
          this.loaderService.changeLoad.next(false)
          this.patchProviderDetails(responce.result)
          this.providerDetalsBeforUpdate = responce.result
        },
        error: (error: HttpErrorResponse) => {
          this.loaderService.changeLoad.next(false)
          const errmsg = _.get(error, 'error.params.errMsg', 'Something went worng, please try again later')
          this.showSnackBar(errmsg)
        },
      })
    }
  }

  patchProviderDetails(providerDetails: any) {
    this.providerFormGroup.setValue({
      contentPartnerName: _.get(providerDetails, 'data.contentPartnerName', ''),
      websiteUrl: _.get(providerDetails, 'data.websiteUrl', ''),
      description: _.get(providerDetails, 'data.description', ''),
      providerTips: [],
    })
    this.imageUrl = _.get(providerDetails, 'data.link')
    this.thumbNailUrl = this.imageUrl
    if (_.get(providerDetails, 'data.documentUrl')) {
      this.uploadedPdfUrl = _.get(providerDetails, 'data.documentUrl', '')
      this.pdfUploaded = true
      this.fileName = this.getFileName
    }
    _.get(providerDetails, 'data.providerTips', []).forEach((tip: string) => {
      this.addTips(tip)
    })
    this.setTransformationDetails(providerDetails)
  }

  get getFileName() {
    let fileName = ''
    const fileNameWithPrefix = this.uploadedPdfUrl.split('/').pop()
    if (fileNameWithPrefix) {
      fileName = fileNameWithPrefix.includes('_')
        ? fileNameWithPrefix.split('_').slice(1).join('_')
        : fileNameWithPrefix
    }
    return fileName
  }

  setTransformationDetails(providerDetails: any) {
    const providerName = _.get(providerDetails, 'data.contentPartnerName', '').toLowerCase()
    if (providerName) {
      const configuration = this.providerConfiguration[providerName]
      this.partnerCode = _.get(providerDetails, 'partnerCode', _.get(configuration, 'partnerCode'))
      this.transforamtionForm.setValue({
        trasformContentJson: providerDetails.trasformContentJson ? providerDetails.trasformContentJson : _.get(configuration, 'trasformContentJson'),
        transformProgressJson: providerDetails.transformProgressJson ? providerDetails.transformProgressJson : _.get(configuration, 'transformProgressJson'),
        trasformCertificateJson: providerDetails.trasformCertificateJson ? providerDetails.trasformCertificateJson : _.get(configuration, 'trasformCertificateJson'),
      })
    }
  }

  get getTipsList() {
    return this.providerFormGroup.get('providerTips') as FormArray
  }

  addTips(message = '') {
    this.getTipsList.push(new FormControl(message, Validators.required))
  }

  removeTipAtIndex(index: number) {
    this.getTipsList.removeAt(index)
  }

  getTextLength(controlName: string) {
    return _.get(this.providerFormGroup.get(controlName), 'value.length', 0)
  }

  //#region (thumnail upload)

  onThumbNailSelected(event: any): void {
    this.thumbnailFile = event
    if (this.thumbnailFile) {
      const reader = new FileReader()
      reader.onload = (e: any) => {
        const img = new Image()
        img.onload = () => {
          this.cropImage(img)
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(this.thumbnailFile)
    }
  }

  cropImage(image: HTMLImageElement): void {
    const canvas = this.canvas.nativeElement
    const ctx = canvas.getContext('2d')

    const aspectRatio = 16 / 9
    let width = image.width
    let height = image.height
    if (width / height > aspectRatio) {
      width = height * aspectRatio
    } else {
      height = width / aspectRatio
    }

    const startX = (image.width - width) / 2
    const startY = (image.height - height) / 2

    canvas.width = width
    canvas.height = height

    if (ctx) {
      ctx.drawImage(image, startX, startY, width, height, 0, 0, width, height)
    }
    canvas.toBlob(blob => {
      if (blob) {
        this.thumbnailFile = new File([blob], this.thumbnailFile.name, {
          type: 'image/png',
          lastModified: Date.now(),
        })
      }
    }, 'image/png')

    this.imageUrl = canvas.toDataURL('image/png')
  }
  //#endregion

  onDrop(file: File) {
    const fileName = file.name.replace(/[^A-Za-z0-9_.]/g, '')
    if (!fileName.toLowerCase().endsWith('.pdf')) {
      this.showSnackBar('Please upload PDF file')
    } else if (file.size > this.FILE_UPLOAD_MAX_SIZE) {
      this.showSnackBar('file size should not be more than 100 MB')
    } else {
      this.pdfFile = file
      this.pdfUploaded = true
      this.fileName = file.name
      this.fileUploadedDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy')
    }
  }

  removePdf() {
    this.pdfFile = null
    this.pdfUploaded = false
    this.fileName = ''
    this.uploadedPdfUrl = ''
  }

  //#region (submit details or update)
  submit() {
    if (this.providerFormGroup.valid && this.imageUrl) {
      this.createContentsToUpload()
    }
  }

  createContentsToUpload() {
    const resourceCreationSubscriptions: any = []
    this.loaderService.changeLoad.next(true)
    if (this.thumbnailFile) {
      const formData = new FormData()
      formData.append(
        'content',
        this.thumbnailFile as Blob,
        (this.thumbnailFile as File).name.replace(/[^A-Za-z0-9_.]/g, ''),
      )
      resourceCreationSubscriptions.push(
        this.marketPlaceSvc.uploadThumbNail(formData).pipe(
          mergeMap((res: any) => {
            return of({
              fileType: 'thumbnail',
              result: res.result,
            })
          })
        )
      )
    }
    if (this.pdfFile) {
      const formData = new FormData()
      formData.append(
        'content',
        this.pdfFile as Blob,
        (this.pdfFile as File).name.replace(/[^A-Za-z0-9_.]/g, ''),
      )
      resourceCreationSubscriptions.push(
        this.marketPlaceSvc.uploadCIOSContract(formData).pipe(
          mergeMap((res: any) => {
            return of({
              fileType: 'ciosFile',
              result: res.result,
            })
          })
        )
      )
    }

    forkJoin(resourceCreationSubscriptions).subscribe({
      next: responcess => {
        responcess.forEach((responce: any) => {
          const url = _.get(responce, 'result.url')
            .replace('https://storage.googleapis.com/igot', `${environment.karmYogiPath}/content-store`)
          if (responce.fileType === 'thumbnail') {
            this.thumbNailUrl = url
          } else if (responce.fileType === 'ciosFile') {
            this.uploadedPdfUrl = url
          }
        })
        if (this.providerDetails && this.providerDetails.id) {
          this.upDateProviderDetails()
        } else {
          this.saveProviderDetails()
        }
      },
      error: (error: HttpErrorResponse) => {
        this.loaderService.changeLoad.next(false)
        const errmsg = _.get(error, 'error.params.errMsg', 'Something went worng, please try again later')
        this.showSnackBar(errmsg)
      },
    })

    if (resourceCreationSubscriptions.length === 0 && this.providerDetails && this.providerDetails.id) {
      this.upDateProviderDetails()
    }
  }

  saveProviderDetails() {
    if (this.providerFormGroup.valid && this.imageUrl) {
      const formDetails = this.providerFormGroup.value
      const formBody: any = {
        websiteUrl: formDetails.websiteUrl,
        isActive: true,
        description: formDetails.description,
        contentPartnerName: formDetails.contentPartnerName,
        providerTips: formDetails.providerTips,
        link: this.thumbNailUrl,
        documentUrl: this.uploadedPdfUrl,
      }

      if (this.providerDetails) {
        if (this.providerDetails.id) {
          formBody['id'] = this.providerDetails.id
        }
        if (this.partnerCode) {
          formBody['partnerCode'] = this.partnerCode
          const tranforamtions = this.transforamtionForm.value
          formBody['trasformContentJson'] = tranforamtions.trasformContentJson
          formBody['transformProgressJson'] = tranforamtions.transformProgressJson
          formBody['trasformCertificateJson'] = tranforamtions.trasformCertificateJson
        }
      }

      this.marketPlaceSvc.createProvider(formBody).subscribe({
        next: (responce: any) => {
          this.loaderService.changeLoad.next(false)
          if (responce) {
            setTimeout(() => {
              const successMsg = 'Successfully Onboarded'
              this.showSnackBar(successMsg)
              this.navigateToProvidersDashboard()
            }, 1000)
          }
        },
        error: (error: HttpErrorResponse) => {
          this.loaderService.changeLoad.next(false)
          const errmsg = _.get(error, 'error.params.errMsg', 'Something went worng, please try again later')
          this.showSnackBar(errmsg)
        },
      })
    }
  }

  upDateProviderDetails() {
    if (this.providerFormGroup.valid && this.imageUrl) {
      const formDetails = this.providerFormGroup.value
      this.providerDetalsBeforUpdate['data']['websiteUrl'] = formDetails.websiteUrl
      this.providerDetalsBeforUpdate['data']['isActive'] = true
      this.providerDetalsBeforUpdate['data']['description'] = formDetails.description
      this.providerDetalsBeforUpdate['data']['contentPartnerName'] = formDetails.contentPartnerName
      this.providerDetalsBeforUpdate['data']['providerTips'] = formDetails.providerTips
      this.providerDetalsBeforUpdate['data']['link'] = this.thumbNailUrl
      this.providerDetalsBeforUpdate['data']['documentUrl'] = this.uploadedPdfUrl
      const tranforamtions = this.transforamtionForm.value
      this.providerDetalsBeforUpdate['trasformContentJson'] = tranforamtions.trasformContentJson
      this.providerDetalsBeforUpdate['transformProgressJson'] = tranforamtions.transformProgressJson
      this.providerDetalsBeforUpdate['trasformCertificateJson'] = tranforamtions.trasformCertificateJson

      this.marketPlaceSvc.updateProvider(this.providerDetalsBeforUpdate).subscribe({
        next: (responce: any) => {
          this.loaderService.changeLoad.next(false)
          if (responce) {
            setTimeout(() => {
              const successMsg = 'Successfully Onboarded'
              this.showSnackBar(successMsg)
              this.navigateToProvidersDashboard()
            }, 1000)
          }
        },
        error: (error: HttpErrorResponse) => {
          this.loaderService.changeLoad.next(false)
          const errmsg = _.get(error, 'error.params.errMsg', 'Something went worng, please try again later')
          this.showSnackBar(errmsg)
        },
      })
    }
  }

  navigateToProvidersDashboard() {
    this.router.navigateByUrl('/app/home/marketplace-providers')
  }
  //#endregion

  showSnackBar(message: string) {
    this.snackBar.open(message)
  }

}
