import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'ws-app-configure-marketplace-providers',
  templateUrl: './configure-marketplace-providers.component.html',
  styleUrls: ['./configure-marketplace-providers.component.scss']
})
export class ConfigureMarketplaceProvidersComponent implements OnInit {

  widgetData = {
    titles: [
      { title: 'Marketplace Providers', url: 'none' },
      { title: 'Onboard Provider', url: 'none' },
      { title: 'Configure', url: 'app/home/marketplace-providers/onboard-partner' }
    ]
  }

  constructor() { }

  ngOnInit() {
  }

}
