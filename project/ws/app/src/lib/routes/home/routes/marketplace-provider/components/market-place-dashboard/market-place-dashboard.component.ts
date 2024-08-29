import { Component, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { ConformationPopupComponent } from '../../dialogs/conformation-popup/conformation-popup.component'
import { MatDialog, MatSnackBar } from '@angular/material'
import { Router } from '@angular/router'
import { MarketplaceService } from '../../services/marketplace.service'
import { HttpErrorResponse } from '@angular/common/http'
import * as _ from 'lodash'
import { debounceTime } from 'rxjs/operators'

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

  providersList: any = []
  searchControl = new FormControl()
  apiSubscription: any
  displayLoader = false

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private marketPlaceSvc: MarketplaceService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.getProviders()
    this.subscribeValueChanges()
  }

  getProviders(searchKey?: string) {
    this.displayLoader = true
    this.providersList = []
    const formBody: any = {
      filterCriteriaMap: {
        isActive: true
      },
      pageNumber: 0,
      pageSize: 10,
      facets: [
        "contentPartnerName"
      ],
      orderBy: "createdOn",
      orderDirection: "desc"
    }

    if (searchKey) {
      formBody['searchString'] = searchKey
    }

    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe()
    }

    this.apiSubscription = this.marketPlaceSvc.getProvidersList(formBody).subscribe({
      next: (responce: any) => {
        this.displayLoader = false
        this.providersList = _.get(responce, 'result.data', [])
      },
      error: (error: HttpErrorResponse) => {
        this.displayLoader = false
        const errmsg = _.get(error, 'error.params.errMsg')
        this.showSnackBar(errmsg)
      }
    })
  }

  subscribeValueChanges() {
    if (this.searchControl) {
      this.searchControl.valueChanges.pipe(debounceTime(500)).subscribe((searchKey: any) => {
        console.log('searchKey: ', searchKey)
        this.getProviders(searchKey)
      })
    }
  }

  providerEvents(event: any, provider: any) {
    switch (event.action) {
      case 'edit':
        const providerDetails = {
          id: _.get(provider, 'id'),
          providerName: _.get(provider, 'contentPartnerName')
        }
        this.navigateToConfiguration(event.mode, providerDetails)
        break
      case 'delete':
        console.log(event, provider)
        this.openConformationPopup(provider)
        break
      case 'update':
        // this.openConformationPopup()
        break
      case 'Configure':
        this.navigateToConfiguration(event.mode, provider)
        break
    }
  }

  navigateToConfiguration(tab: string = 'provider', providerDetails?: any) {
    this.router.navigate(['/app/home/marketplace-providers/onboard-partner'],
      { state: { tab: tab, providerDetails: providerDetails } })
  }

  openConformationPopup(provider: any) {
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
        this.deleteProvider(_.get(provider, 'id'))
      }
    })
  }

  deleteProvider(partnerId: string) {
    this.displayLoader = true
    this.marketPlaceSvc.deleteProvider(partnerId).subscribe({
      next: (res: any) => {
        if (res) {
          setTimeout(() => {
            this.getProviders()
          }, 2000)
        } else {
          this.displayLoader = false
        }
      },
      error: (error: HttpErrorResponse) => {
        this.displayLoader = false
        const errmsg = _.get(error, 'error.params.errMsg', 'Something went wrong')
        this.showSnackBar(errmsg)
      }
    })
  }

  showSnackBar(message: string) {
    this.snackBar.open(message)
  }

}
