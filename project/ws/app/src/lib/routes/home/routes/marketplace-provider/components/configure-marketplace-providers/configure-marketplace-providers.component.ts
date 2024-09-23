import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import * as _ from 'lodash'

@Component({
  selector: 'ws-app-configure-marketplace-providers',
  templateUrl: './configure-marketplace-providers.component.html',
  styleUrls: ['./configure-marketplace-providers.component.scss'],
})
export class ConfigureMarketplaceProvidersComponent implements OnInit {

  widgetData = {
    titles: [
      { title: 'Marketplace Providers', url: 'none' },
      { title: 'Onboard Provider', url: 'none' },
      { title: 'Configure', url: 'app/home/marketplace-providers/onboard-partner' },
    ],
  }
  routerParams: any
  tabIdsList = [
    'provider',
    'contentUpload',
  ]
  selectedIndex = 0
  providerDetails = ''

  constructor(
    private router: Router
  ) {
  }

  ngOnInit() {
    this.getRouterParams()
  }

  getRouterParams() {
    const navigation = this.router.getCurrentNavigation()
    this.routerParams = _.get(navigation, 'extras.state')
    if (this.routerParams) {
      this.providerDetails = _.get(this.routerParams, 'providerDetails')
      this.setCurrentTab(this.routerParams.tab)
    } else {
      this.navigateToProviderDashboard()
    }
  }

  navigateToProviderDashboard() {
    this.router.navigate(['/app/home/marketplace-providers'])
  }

  setCurrentTab(tab: any) {
    const tabIndex = this.tabIdsList.findIndex(tabId => tabId === tab)
    if (tabIndex >= 0) {
      this.selectedIndex = tabIndex
    } else {
      this.navigateToProviderDashboard()
    }
  }

}
