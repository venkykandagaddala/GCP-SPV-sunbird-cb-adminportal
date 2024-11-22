import { NgModule } from '@angular/core'
import { CommonModule, DatePipe } from '@angular/common'
import { MarketPlaceDashboardComponent } from './components/market-place-dashboard/market-place-dashboard.component'
import { ProviderDetailsComponent } from './components/provider-details/provider-details.component'
import { RouterModule, Routes } from '@angular/router'
import { ConfigureMarketplaceProvidersComponent } from './components/configure-marketplace-providers/configure-marketplace-providers.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BreadcrumbsOrgModule } from '@sunbird-cb/collection'
import { HelpCenterGuideComponent } from './components/help-center-guide/help-center-guide.component'
import { ProvidersComponent } from './components/providers/providers.component'
import { ConformationPopupComponent } from './dialogs/conformation-popup/conformation-popup.component'
import { ContentUploadComponent } from './components/content-upload/content-upload.component'
import { CoursesTableComponent } from './components/courses-table/courses-table.component'
import { DragDropDirective } from './directives/drag-drop.directive'
import { PageResolve } from '@sunbird-cb/utils'
import { NgJsonEditorModule } from 'ang-jsoneditor'
import { MatInputModule } from '@angular/material/input'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatTabsModule } from '@angular/material/tabs'
import { MatMenuModule } from '@angular/material/menu'
import { MatDialogModule } from '@angular/material/dialog'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatTableModule } from '@angular/material/table'
import { LoaderService } from '../../services/loader.service'
import { ProviderResolveService } from './services/provider-resolve.service'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: MarketPlaceDashboardComponent,
  },
  {
    path: 'onboard-partner/:id',
    pathMatch: 'full',
    component: ConfigureMarketplaceProvidersComponent,
    data: {
      pageId: 'app/home/marketplace-providers/onboard-partner',
      module: 'marketplace-providers',
      pageType: 'feature',
      pageKey: 'marcket_place',
    },
    resolve: {
      pageData: PageResolve,
      providerDetails: ProviderResolveService,
    },
  },
  {
    path: 'onboard-partner',
    pathMatch: 'full',
    component: ConfigureMarketplaceProvidersComponent,
    data: {
      pageId: 'app/home/marketplace-providers/onboard-partner',
      module: 'marketplace-providers',
      pageType: 'feature',
      pageKey: 'marcket_place',
    },
    resolve: {
      pageData: PageResolve,
    },
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
    CoursesTableComponent,
    DragDropDirective,
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
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatTooltipModule,
    NgJsonEditorModule,
  ],
  providers: [DatePipe, LoaderService],
  entryComponents: [
    ConformationPopupComponent,
  ],
  exports: [RouterModule],
})
export class MarketplaceProviderModule { }
