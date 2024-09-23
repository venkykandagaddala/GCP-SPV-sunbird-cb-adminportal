import { Component, OnInit } from '@angular/core'
import { ConformationPopupComponent } from '../../dialogs/conformation-popup/conformation-popup.component'
import { MatDialog, MatSnackBar } from '@angular/material'
import { Router } from '@angular/router'
import { MarketplaceService } from '../../services/marketplace.service'
import { HttpErrorResponse } from '@angular/common/http'
import * as _ from 'lodash'
import { map } from 'rxjs/operators'
import { DatePipe } from '@angular/common'

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
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec suscipit orci in ultricies aliquam. Maecenas tempus fermentum mi, at laoreet elit ultricies eget.',
    ],
    helpVideoLink: 'url',
  }

  providersList: any = []
  apiSubscription: any
  displayLoader = false
  tabledata: any
  searchKey = ''
  paginationDetails: any
  menuItems: {
    icon: string,
    btnText: string,
    action: string
  }[] = []

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private marketPlaceSvc: MarketplaceService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.intializeTableData()
  }

  intializeTableData() {
    this.tabledata = {
      columns: [
        { displayName: 'Content Provider Name', key: 'contentPartnerName', cellType: 'text', imageKey: 'link' },
        { displayName: 'Onboarded On', key: 'createdOn', cellType: 'text', cellClass: 'cell-gray-text' },
        { displayName: 'Last Updated On', key: 'updatedOn', cellType: 'text', cellClass: 'cell-gray-text' },
        { displayName: 'Authentication', key: 'isAuthenticate', cellType: 'authentication' },
      ],
      needCheckBox: false,
      showDeleteAll: false,
    }

    this.menuItems = [
      {
        icon: 'edit',
        btnText: 'Configure',
        action: 'configure',
      },
      // {
      //   icon: 'power_settings_new',
      //   btnText: 'Deactivate',
      //   action: 'deactivate'
      // }
    ]

    this.paginationDetails = {
      startIndex: 0,
      lastIndes: 20,
      pageSize: 20,
      pageIndex: 0,
      totalCount: 20,
    }
    this.getProviders()
  }

  getProviders() {
    this.displayLoader = true
    this.providersList = []
    const formBody: any = {
      filterCriteriaMap: {
        isActive: true,
      },
      pageNumber: this.paginationDetails.pageIndex,
      pageSize: this.paginationDetails.pageSize,
      facets: [
        'contentPartnerName',
      ],
      orderBy: 'createdOn',
      orderDirection: 'desc',
    }

    if (this.searchKey) {
      formBody['searchString'] = this.searchKey
    }

    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe()
    }

    this.apiSubscription = this.marketPlaceSvc.getProvidersList(formBody)
      .pipe(map((responce: any) => {
        const providersDetails = {
          providersList: this.formateProvidersList(_.get(responce, 'result.data', [])),
          totalCount: _.get(responce, 'result.totalCount', 0),
        }
        return providersDetails
      }))
      .subscribe({
        next: (responce: any) => {
          this.displayLoader = false
          this.providersList = responce.providersList
          this.paginationDetails.totalCount = responce.totalCount
        },
        error: (error: HttpErrorResponse) => {
          this.displayLoader = false
          const errmsg = _.get(error, 'error.params.errMsg')
          this.showSnackBar(errmsg)
        },
      })
  }

  onSearch(searchKey: string) {
    this.searchKey = searchKey
    this.getProviders()
  }

  formateProvidersList(responce: any) {
    const formatedList: any = []
    if (responce) {
      responce.forEach((element: any) => {
        element.createdOn = this.datePipe.transform(new Date(element.createdOn), 'MMM dd, yyyy')
        element.updatedOn = this.datePipe.transform(new Date(element.createdOn), 'MMM dd, yyyy')
        formatedList.push(element)
      })
    }
    return formatedList
  }

  providerEvents(event: any) {
    switch (event.action) {
      case 'configure':
        const providerDetails = {
          id: _.get(event, 'rows.id'),
          providerName: _.get(event, 'rows.contentPartnerName'),
          isAuthenticated: _.get(event, 'rows.isAuthenticate', false),
          partnerCode: _.get(event, 'rows.partnerCode', false),
        }
        this.navigateToConfiguration(event.mode, providerDetails)
        break
      case 'deactivate':
        this.openConformationPopup(event.row)
        break
    }
  }

  navigateToConfiguration(tab: string = 'provider', providerDetails?: any) {
    this.router.navigate(['/app/home/marketplace-providers/onboard-partner'],
                         { state: { tab, providerDetails } })
  }

  openConformationPopup(provider: any) {
    const dialogData = {
      dialogType: 'warning',
      descriptions: [
        {
          header: 'Deactivating this provider will permanently disable its services after 15 days.',
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
          },         2000)
        } else {
          this.displayLoader = false
        }
      },
      error: (error: HttpErrorResponse) => {
        this.displayLoader = false
        const errmsg = _.get(error, 'error.params.errMsg', 'Something went wrong')
        this.showSnackBar(errmsg)
      },
    })
  }

  onPageChange(event: any) {
    this.paginationDetails = event
    this.getProviders()
  }

  showSnackBar(message: string) {
    this.snackBar.open(message)
  }

}
