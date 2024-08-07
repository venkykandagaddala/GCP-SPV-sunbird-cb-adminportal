import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MarketPlaceDashboardComponent } from './components/market-place-dashboard/market-place-dashboard.component'
import { ProviderDetailsComponent } from './components/provider-details/provider-details.component'
import { RouterModule, Routes } from '@angular/router'
import { ConfigureMarketplaceProvidersComponent } from './components/configure-marketplace-providers/configure-marketplace-providers.component'
import { MatCardModule, MatButtonModule, MatIconModule, MatExpansionModule, MatTabsModule, MatInputModule } from '@angular/material'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BreadcrumbsOrgModule } from '@sunbird-cb/collection'

const routes: Routes = [
  {
    path: '',
    component: MarketPlaceDashboardComponent,
  },
  {
    path: 'onboard-partner',
    component: ConfigureMarketplaceProvidersComponent,
  },
]

@NgModule({
  declarations: [
    MarketPlaceDashboardComponent,
    ProviderDetailsComponent,
    ConfigureMarketplaceProvidersComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatTabsModule,
    BreadcrumbsOrgModule
  ],
  exports: [RouterModule],
})
export class MarketplaceProviderModule { }
