import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import * as _ from 'lodash'
import { MarketplaceService } from '../../services/marketplace.service'
import { HttpErrorResponse } from '@angular/common/http'
import { MatSnackBar } from '@angular/material'
import { LoaderService } from '../../../../services/loader.service'
import { DatePipe } from '@angular/common'
import { forkJoin } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConfigurationsService } from '@sunbird-cb/utils'

@Component({
  selector: 'ws-app-provider-details',
  templateUrl: './provider-details.component.html',
  styleUrls: ['./provider-details.component.scss'],
  providers: [LoaderService],
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
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec suscipit orci in ultricies aliquam. Maecenas tempus fermentum mi, at laoreet elit ultricies eget.'
    ],
    helpVideoLink: 'url'
  }
  providerFormGroup!: FormGroup

  imageUrl!: string
  thumbnailFile: any
  pdfFileUploadCondition = {
    fileName: false,
    eval: false,
    externalReference: false,
    iframe: false,
    isSubmitPressed: false,
    preview: false,
    url: '',
  }
  FILE_UPLOAD_MAX_SIZE = 100 * 1024 * 1024
  pdfUploaded = false
  pdfFile: any
  thumbNailUrl = ''
  uploadedPdfUrl = ''
  fileName = ''
  fileUploadedDate: string | null = ''
  thumbnailResourceId = ''
  pdfResourceId = ''

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private marketPlaceSvc: MarketplaceService,
    private snackBar: MatSnackBar,
    private loaderService: LoaderService,
    private datePipe: DatePipe,
    private configService: ConfigurationsService,
    private activatedRoute: ActivatedRoute
  ) {
    this.initialization()
  }

  ngOnInit() {
    this.loaderService.changeLoad.next(true)
  }

  initialization() {
    this.providerFormGroup = this.formBuilder.group({
      contentPartnerName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.\-_$/:\[\] ' !]*$/), Validators.maxLength(70)]),
      websiteUrl: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.\-_$/:\[\] ' !]*$/), Validators.maxLength(70)]),
      description: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.\-_$/:\[\] ' !]*$/), Validators.maxLength(600)]),
      providerTips: this.formBuilder.array([])
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.providerDetails && changes.providerDetails.currentValue) {
      this.getProviderDetails()
    }
  }

  getProviderDetails() {
    if (this.providerDetails && this.providerDetails.id) {
      this.marketPlaceSvc.getProviderDetails(this.providerDetails.id).subscribe({
        next: (responce: any) => {
          this.patchProviderDetails(responce.result)
        },
        error: (error: HttpErrorResponse) => {
          console.log('error: ', error)
        }
      })
    }
  }

  patchProviderDetails(providerDetails: any) {
    this.providerFormGroup.setValue({
      contentPartnerName: _.get(providerDetails, 'contentPartnerName', ''),
      websiteUrl: _.get(providerDetails, 'websiteUrl', ''),
      description: _.get(providerDetails, 'description', ''),
      providerTips: []
    })
    this.imageUrl = _.get(providerDetails, 'thumbnailUrl')
    this.thumbNailUrl = this.imageUrl
    this.uploadedPdfUrl = _.get(providerDetails, 'documentUrl')
    _.get(providerDetails, 'providerTips', []).forEach((tip: string) => {
      this.addTips(tip)
    })
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
  // uploadThumbnail() {
  //   this.thumbNailInput.nativeElement.click()
  // }

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
    canvas.toBlob((blob) => {
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
    this.pdfFileUploadCondition = {
      fileName: false,
      eval: false,
      externalReference: false,
      iframe: false,
      isSubmitPressed: false,
      preview: false,
      url: '',
    }
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

  submit() {
    // if (this.providerFormGroup.valid && this.imageUrl) {
    this.createContentsToUpload()
    // }
  }

  createContentsToUpload() {
    const userProfileConfig = this.configService.userProfileV2
    const userProfile = _.get(this.activatedRoute, 'snapshot.parent.data.configService.userProfile')
    console.log('user profile', userProfile)
    console.log('user profile config', userProfileConfig)
    // const resourceCreationSubscriptions: any = []

    // if (this.thumbnailFile) {
    //   const req = {
    //     request: {
    //       content: {
    //         code: "8296417517328792",//
    //         contentType: "Resource",
    //         createdBy: "25311a4f-fa42-4cf7-882a-5e79198edfcb",//
    //         createdFor: [
    //           "01376822290813747263"// org id
    //         ],
    //         creator: "SPV Admin",
    //         framework: "igot",
    //         mimeType: "application/pdf",
    //         name: "", // name
    //         organisation: [
    //           "TarentoCBP" //org name
    //         ],
    //         isExternal: false,
    //         primaryCategory: "Learning Resource",
    //         license: "CC BY 4.0",
    //         ownershipType: [
    //           "createdFor"
    //         ],
    //         visibility: "Default",
    //         language: [
    //           "English"
    //         ],
    //         resourceType: "PDF",
    //       }
    //     }
    //   }
    //   resourceCreationSubscriptions.push(
    //     this.marketPlaceSvc.createResource(req).pipe(
    //       map(responce => {
    //         const uploadedFile = this.trigerUpload(this.thumbnailFile, _.get(responce, 'result.identifier'))
    //         const formatedResponce = {
    //           resourceType: 'thumbnail',
    //           responce: uploadedFile
    //         }
    //         return formatedResponce
    //       })
    //     )
    //   )
    // }
    // if (this.pdfFile) {
    //   const req = {
    //     request: {
    //       content: {
    //         code: this.genrateRandomNumber,
    //         contentType: 'Resource',
    //         createdBy: '',//
    //         createdFor: '',//
    //         creator: 'PROGRAM COORDINATOR',
    //         description: '',
    //         framework: 'igot',
    //         mimeType: this.pdfFile.type,
    //         name: this.fileName,
    //         organisation: '',//
    //         isExternal: false,
    //         primaryCategory: 'Session Handout',
    //         license: '',//
    //         ownershipType: ['createdFor'],
    //         purpose: '',
    //         visibility: 'Default',
    //       },
    //     },
    //   }
    //   resourceCreationSubscriptions.push(
    //     this.marketPlaceSvc.createResource(req).pipe(
    //       map(responce => {
    //         const uploadedFile = this.trigerUpload(this.pdfFile, _.get(responce, 'result.identifier'))
    //         const formatedResponce = {
    //           resourceType: 'pdfFile',
    //           responce: uploadedFile
    //         }
    //         return formatedResponce
    //       })
    //     )
    //   )
    // }

    // forkJoin(resourceCreationSubscriptions).subscribe({
    //   next: (responcess) => {
    //     responcess.forEach((responce: any) => {
    //       const identifier = _.get(responce, 'result.identifier')
    //       if (responce.resourceType === 'thumbnail') {
    //         this.thumbnailResourceId = identifier
    //       } else if (responce.resourceType === 'pdfFile') {
    //         this.pdfResourceId = identifier
    //       }
    //     })
    //     this.saveProviderDetails()
    //   },
    //   error: (errorMsg: HttpErrorResponse) => {
    //     console.log(errorMsg)
    //   }
    // })

    // if (resourceCreationSubscriptions.length === 0 && this.providerDetails.id) {
    //   this.saveProviderDetails()
    // }
  }

  get genrateRandomNumber(): string {
    let randomNumber = ''
    for (let i = 0; i < 16; i++) {
      randomNumber += Math.floor(Math.random() * 10)
    }
    return randomNumber
  }

  trigerUpload(fileToUpload: any, resourceId: any) {
    const formdata = new FormData()
    formdata.append(
      'content',
      fileToUpload as Blob,
      (fileToUpload as File).name.replace(/[^A-Za-z0-9_.]/g, ''),
    )

    return this.marketPlaceSvc.upload(formdata, resourceId)
  }

  saveProviderDetails() {
    if (this.providerFormGroup.valid && this.imageUrl) {
      const formBody: any = {
        websiteUrl: this.providerFormGroup.get('websiteUrl')!.value,
        isActive: true,
        description: this.providerFormGroup.get('description')!.value,
        contentPartnerName: this.providerFormGroup.get('contentPartnerName')!.value,
        providerTips: this.providerFormGroup.get('providerTips')!.value,
        thumbnailUrl: this.thumbNailUrl,
        documentUrl: this.uploadedPdfUrl,
      }

      if (this.providerDetails && this.providerDetails.id) {
        formBody['id'] = this.providerDetails.id
      }

      this.marketPlaceSvc.createProvider(formBody).subscribe({
        next: (responce: any) => {
          if (responce) {
            this.navigateToProvidersDashboard()
            // this.providerDetails = responce.result
            // if (navigateToDashboard) {
            //   this.navigateToProvidersDashboard()
            // } else if (this.thumbnailFile || this.pdfFile) {
            //   this.triggerPDFUpload()
            // }
          }
        },
        error: (error: HttpErrorResponse) => {
          const errmsg = _.get(error, 'error.params.errMsg')
          this.showSnackBar(errmsg)
        }
      })
    }
  }

  navigateToProvidersDashboard() {
    this.router.navigateByUrl('/app/home/marketplace-providers')
  }

  showSnackBar(message: string) {
    this.snackBar.open(message)
  }

}
