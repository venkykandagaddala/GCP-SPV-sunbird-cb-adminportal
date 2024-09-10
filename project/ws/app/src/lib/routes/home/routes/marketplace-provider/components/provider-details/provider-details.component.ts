import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import * as _ from 'lodash'
import { MarketplaceService } from '../../services/marketplace.service'
import { HttpErrorResponse } from '@angular/common/http'
import { MatSnackBar } from '@angular/material'
import { LoaderService } from '../../../../services/loader.service'
import { DatePipe } from '@angular/common'
import { forkJoin, of } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

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
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec suscipit orci in ultricies aliquam. Maecenas tempus fermentum mi, at laoreet elit ultricies eget.',
    ],
    helpVideoLink: 'url',
  }
  providerFormGroup!: FormGroup

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

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private marketPlaceSvc: MarketplaceService,
    private snackBar: MatSnackBar,
    private loaderService: LoaderService,
    private datePipe: DatePipe
  ) {
    this.initialization()
  }

  ngOnInit() {
    this.loaderService.changeLoad.next(true)
  }

  initialization() {
    this.providerFormGroup = this.formBuilder.group({
      orgId: new FormControl('', [Validators.required]),
      contentPartnerName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.\-_$/:\[\] ' !]*$/), Validators.maxLength(70)]),
      websiteUrl: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.\-_$/:\[\] ' !]*$/), Validators.maxLength(70)]),
      description: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.\-_$/:\[\] ' !]*$/), Validators.maxLength(500)]),
      providerTips: this.formBuilder.array([]),
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
          const errmsg = _.get(error, 'error.params.errMsg', 'Something went worng, please try again later')
          this.showSnackBar(errmsg)
        },
      })
    }
  }

  patchProviderDetails(providerDetails: any) {
    this.providerFormGroup.setValue({
      orgId: _.get(providerDetails, 'orgId', ''),
      contentPartnerName: _.get(providerDetails, 'contentPartnerName', ''),
      websiteUrl: _.get(providerDetails, 'websiteUrl', ''),
      description: _.get(providerDetails, 'description', ''),
      providerTips: [],
    })
    if (this.providerFormGroup && this.providerFormGroup.get('orgId')) {
      this.providerFormGroup.controls.orgId.disable()
    }
    this.imageUrl = _.get(providerDetails, 'link')
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
    },            'image/png')

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

  submit() {
    if (this.providerFormGroup.valid && this.imageUrl) {
      this.createContentsToUpload()
    }
  }

  createContentsToUpload() {
    const resourceCreationSubscriptions: any = []

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
            .replace('https://storage.googleapis.com/igot', 'https://portal.dev.karmayogibharat.net/content-store')
          if (responce.fileType === 'thumbnail') {
            this.thumbNailUrl = url
          } else if (responce.fileType === 'ciosFile') {
            this.uploadedPdfUrl = url
          }
        })
        this.saveProviderDetails()
      },
      error: (error: HttpErrorResponse) => {
        const errmsg = _.get(error, 'error.params.errMsg', 'Something went worng, please try again later')
        this.showSnackBar(errmsg)
      },
    })

    if (resourceCreationSubscriptions.length === 0 && this.providerDetails.id) {
      this.saveProviderDetails()
    }
  }

  saveProviderDetails() {
    if (this.providerFormGroup.valid && this.imageUrl) {
      const formDetails = this.providerFormGroup.value
      const formBody: any = {
        orgId: formDetails.orgId,
        websiteUrl: formDetails.websiteUrl,
        isActive: true,
        description: formDetails.description,
        contentPartnerName: formDetails.contentPartnerName,
        providerTips: formDetails.providerTips,
        link: this.thumbNailUrl,
        documentUrl: this.uploadedPdfUrl,
      }

      if (this.providerDetails && this.providerDetails.id) {
        formBody['id'] = this.providerDetails.id
      }

      this.marketPlaceSvc.createProvider(formBody).subscribe({
        next: (responce: any) => {
          if (responce) {
            const successMsg = 'Successfully Onboarded'
            this.showSnackBar(successMsg)
            this.navigateToProvidersDashboard()
          }
        },
        error: (error: HttpErrorResponse) => {
          const errmsg = _.get(error, 'error.params.errMsg', 'Something went worng, please try again later')
          this.showSnackBar(errmsg)
        },
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
