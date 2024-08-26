import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import * as _ from 'lodash'
import { MarketplaceService } from '../../services/marketplace.service'
import { HttpErrorResponse } from '@angular/common/http'
import { MatSnackBar } from '@angular/material'

@Component({
  selector: 'ws-app-provider-details',
  templateUrl: './provider-details.component.html',
  styleUrls: ['./provider-details.component.scss'],
})
export class ProviderDetailsComponent implements OnInit, OnChanges {
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
  imageBlob!: Blob
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

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private marketPlaceSvc: MarketplaceService,
    private snackBar: MatSnackBar
  ) {
    this.initialization()
  }

  ngOnInit() {
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

  uploadThumbnail() {
    this.fileInput.nativeElement.click()
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e: any) => {
        const img = new Image()
        img.onload = () => {
          this.cropImage(img)
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
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
        this.imageBlob = blob!
        this.imageUrl = URL.createObjectURL(blob)
      }
    }, 'image/png')
  }

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
      // this.assignFileValues(file, fileName)
    }
  }

  // assignFileValues(file: File, fileName: string) {
  //   this.mimeType = 'application/pdf'
  //   if (
  //     (currentContentData.status === 'Live' || currentContentData.prevStatus === 'Live')
  //     && this.mimeType !== currentContentData.mimeType
  //   ) {
  //     this.snackBar.openFromComponent(NotificationComponent, {
  //       data: {
  //         type: Notify.CANNOT_CHANGE_MIME_TYPE,
  //       },
  //       duration: NOTIFICATION_TIME * 1000,
  //     })
  //     this.fileUploadForm.controls.artifactUrl.setValue(currentContentData.artifactUrl)
  //     this.mimeType = currentContentData.mimeType
  //     this.iprChecked()
  //   } else {
  //     this.file = file
  //     if (this.mimeType === 'video/mp4' || this.mimeType === 'audio/mpeg') {
  //       this.getDuration()
  //     } else if (this.mimeType === 'application/vnd.ekstep.html-archive') {
  //       this.extractFile()
  //     }
  //   }
  // }

  saveProviderDetails() {
    if (this.providerFormGroup.valid && this.imageUrl) {
      const formBody: any = {
        websiteUrl: this.providerFormGroup.get('websiteUrl')!.value,
        isActive: true,
        description: this.providerFormGroup.get('description')!.value,
        contentPartnerName: this.providerFormGroup.get('contentPartnerName')!.value,
        documentUrl: "https://www.example.com/document.pdf",
        providerTips: this.providerFormGroup.get('providerTips')!.value,
        thumbnailUrl: "https://portal.karmayogiqa.nic.in/content-store/content/do_1140936641201520641494/artifact/do_1140936641201520641494_1720420145273_red-shield-copy-final.jpg",
      }

      if (this.providerDetails && this.providerDetails.id) {
        formBody['id'] = this.providerDetails.id
      }

      this.marketPlaceSvc.createProvider(formBody).subscribe({
        next: (responce: any) => {
          if (responce) {
            this.navigateToProvidersDashboard()
          }
        },
        error: (error: HttpErrorResponse) => {
          console.log('error: ', error)
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
