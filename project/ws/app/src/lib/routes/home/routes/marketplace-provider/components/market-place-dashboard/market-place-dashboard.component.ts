import { Component, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { ConformationPopupComponent } from '../../dialogs/conformation-popup/conformation-popup.component'
import { MatDialog } from '@angular/material'

@Component({
  selector: 'ws-app-market-place-dashboard',
  templateUrl: './market-place-dashboard.component.html',
  styleUrls: ['./market-place-dashboard.component.scss'],
})
export class MarketPlaceDashboardComponent implements OnInit {

  helpCenterGuide = {
    header: 'SPV Help Center: Video Guides and Tips',
    guideNotes: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec suscipit orci in ultricies aliquam. Maecenas tempus fermentum mi, at laoreet elit ultricies eget.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec suscipit orci in ultricies aliquam. Maecenas tempus fermentum mi, at laoreet elit ultricies eget.'
    ],
    helpVideoLink: 'url'
  }

  providersList: any = [
    {
      providerImg: '/assets/icons/png.svg',
      providerName: 'Cornell University',
      providerDetails: {
        id: '#123457',
        totalCourses: '123',
        LastUpdatedOn: '15 Mar 2024, 11:33 AM',
        authenticationApproved: false,
        contentUpdatedOn: '',
        ProgressUpdatedOn: '',
        CertificationOn: ''
      }
    },
    {
      providerImg: '/assets/icons/png.svg',
      providerName: 'Cornell University',
      providerDetails: {
        id: '#123457',
        totalCourses: '123',
        LastUpdatedOn: '15 Mar 2024, 11:33 AM',
        authenticationApproved: true,
        contentUpdatedOn: '',
        ProgressUpdatedOn: '',
        CertificationOn: ''
      }
    },
    {
      providerImg: '/assets/icons/png.svg',
      providerName: 'University of Michigan',
      providerDetails: {
        id: '#123457',
        totalCourses: '123',
        LastUpdatedOn: '15 Mar 2024, 11:33 AM',
        authenticationApproved: true,
        contentUpdatedOn: '15 Mar 2024, 11:33 AM',
        ProgressUpdatedOn: '15 Mar 2024, 11:33 AM',
        CertificationOn: '15 Mar 2024, 11:33 AM'
      }
    }
  ]
  searchControl = new FormControl()

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  providerEvents(event: any, provider: any) {
    switch (event.action) {
      case 'edit':
        console.log(event, provider)
        break
      case 'delete':
        console.log(event, provider)
        break
      case 'update':
        this.openConformationPopup()
        break
    }
  }

  openConformationPopup() {
    const dialogData = {
      dialogType: 'warning',
      descriptions: [
        {
          header: 'This will delete this provider permanently.',
          headerClass: 'flex items-center justify-center text-blue',
          messages: [
            {
              msgClass: '',
              msg: `Do you still want to proceed?`,
            },
          ],
        },
      ],
      footerClass: 'items-center justify-center',
      buttons: [
        {
          btnText: 'No',
          btnClass: 'btn-outline',
          response: false,
        },
        {
          btnText: 'Yes',
          btnClass: 'btn-full-success',
          response: true,
        },
      ],
    }
    const dialogRef = this.dialog.open(ConformationPopupComponent, {
      data: dialogData,
      autoFocus: false,
      width: '626px',
      maxWidth: '80vw',
      maxHeight: '90vh',
      height: '225px',
      disableClose: true,
    })
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
      }
    })
  }

}
