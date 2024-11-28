import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { CreateMDOService } from '../create-mdo.services'
import { CustomRegistrationQRCodeResponse } from '../interface/interfaces'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Clipboard } from '@angular/cdk/clipboard'
import { MatDialog } from '@angular/material/dialog'
import { InfoModalComponent } from '../../info-modal/info-modal.component'

@Component({
  selector: 'ws-app-custom-self-registration',
  templateUrl: './custom-self-registration.component.html',
  styleUrls: ['./custom-self-registration.component.scss']
})
export class CustomSelfRegistrationComponent implements OnInit, OnDestroy {

  @Output() buttonClick = new EventEmitter()
  @Output() linkGenerated = new EventEmitter()
  @Input() initialData: any = null

  selfRegistrationForm!: FormGroup
  customRegistrationLinks!: CustomRegistrationQRCodeResponse
  isLoading = false
  todayDate = new Date()
  selectedButton = ''
  constructor(
    private formBuilder: FormBuilder,
    private createMdoService: CreateMDOService,
    private snackbar: MatSnackBar,
    private clipboard: Clipboard,
    private dialog: MatDialog) {

    this.addOverflowHidden()
  }

  ngOnInit(): void {
    this.initializeForm()
  }

  ngOnDestroy(): void {
    this.removeOverflowHidden()
  }

  initializeForm(): void {
    this.selfRegistrationForm = this.formBuilder.group({
      startDate: ['',],
      endDate: ['',]
    })

    if (this.initialData.qrRegistrationLink) {
      // this.selfRegistrationForm.get('startDate')?.setValue(new Date(this.initialData.startDateRegistration))
      // this.selfRegistrationForm.get('endDate')?.setValue(new Date(this.initialData.endDateRegistration))
      const links = {
        registrationLink: this.initialData.registrationLink,
        qrRegistrationLink: this.initialData.qrRegistrationLink
      }
      this.customRegistrationLinks = links
      this.initialData.QRGenerated = true
    } else {
      this.generateQRCodeLink()
    }
  }

  checkRegistrationStatus(): boolean {
    // if (!endDateRegistration) return true

    // const endDate = new Date(endDateRegistration)
    // const today = new Date()
    // return today <= endDate
    return true
  }

  closeNaveBar() {
    const event = {
      action: 'close'
    }
    this.buttonClick?.emit(event)
  }

  generateQRCodeLink() {
    const dialogRef = this.dialog.open(InfoModalComponent, {
      data: { type: 'generate-link-loader' },
      width: "",
      disableClose: true,
      panelClass: 'info-dialog'

    })

    this.isLoading = true
    const payload = {
      // registrationStartDate: (Math.floor(this.selfRegistrationForm.controls['startDate'].value.getTime())),
      // registrationEndDate: (Math.floor(this.selfRegistrationForm.controls['endDate'].value.getTime())),
      orgId: this.initialData.orgId
    }
    this.createMdoService.generateSelfRegistrationQRCode(payload).subscribe({
      next: (response: any) => {
        if (response.result && Object.keys(response.result).length > 0 && response.responseCode === 'OK') {
          this.customRegistrationLinks = response.result
          this.initialData.QRGenerated = true
          this.isLoading = false
          this.linkGenerated.emit(true)
          dialogRef.close()
        } else if (response?.params?.errmsg) {
          this.snackbar.open(response?.params?.errmsg, '', { duration: 3000 })
          this.isLoading = false
          dialogRef.close()

        } else {
          this.snackbar.open("Oops! We couldn't generate the link or QR code.Please try again", '', { duration: 3000 })
          this.isLoading = false
          dialogRef.close()

        }
      },
      error: () => {
        this.isLoading = false
        dialogRef.close()
      }
    })

  }

  addOverflowHidden() {
    document.body.classList.add('overflow-hidden')
  }

  removeOverflowHidden() {
    document.body.classList.remove('overflow-hidden')
  }


  copyLinkToClipboard(link: string): void {
    this.clipboard.copy(link)
    this.snackbar.open('Copied!')
  }

  downloadQRCode(QRLink: string) {
    fetch(QRLink)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.blob()
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = 'QRCode.png'
        anchor.click()
        window.URL.revokeObjectURL(url)
      })
      .catch(() => {
        window.open(QRLink, '_blank')
      })
  }

  sendViaEmail(link: string): void {
    if (!link) return
    const message = `Register for ${this.initialData.orgName} by clicking below ${link} `
    const subject = encodeURIComponent('Self Registration Link')
    const body = encodeURIComponent(`Self Registration Link: ${message}`)
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`
    window.open(mailtoLink, '_self')
  }

  sendViaWhatsApp(link: string): void {
    if (!link) return
    const message = `Register for ${this.initialData.orgName} by clicking below ${link} `
    const encodedLink = encodeURIComponent(message)
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedLink}`
    window.open(whatsappUrl, '_blank')
  }

  selectedButtonCode(type: string) {
    this.selectedButton = type
  }

}
