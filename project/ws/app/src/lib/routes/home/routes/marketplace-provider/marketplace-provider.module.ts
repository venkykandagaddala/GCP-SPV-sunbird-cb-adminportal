import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MarketPlaceDashboardComponent } from './components/market-place-dashboard/market-place-dashboard.component'
import { ProviderDetailsComponent } from './components/provider-details/provider-details.component'
import { RouterModule, Routes } from '@angular/router'
import { ConfigureMarketplaceProvidersComponent } from './components/configure-marketplace-providers/configure-marketplace-providers.component'
import { MatCardModule, MatButtonModule, MatIconModule, MatExpansionModule, MatTabsModule, MatInputModule, MatMenuModule, MatDialogModule } from '@angular/material'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BreadcrumbsOrgModule } from '@sunbird-cb/collection'
import { HelpCenterGuideComponent } from './components/help-center-guide/help-center-guide.component'
import { ProvidersComponent } from './components/providers/providers.component'
import { ConformationPopupComponent } from './dialogs/conformation-popup/conformation-popup.component'
import { ContentUploadComponent } from './components/content-upload/content-upload.component'

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
    ConformationPopupComponent,
    MarketPlaceDashboardComponent,
    ProviderDetailsComponent,
    ConfigureMarketplaceProvidersComponent,
    HelpCenterGuideComponent,
    ProvidersComponent,
    ContentUploadComponent,
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
    BreadcrumbsOrgModule,
    MatMenuModule,
    MatDialogModule,
  ],
  entryComponents: [
    ConformationPopupComponent
  ],
  exports: [RouterModule],
})
export class MarketplaceProviderModule { }
