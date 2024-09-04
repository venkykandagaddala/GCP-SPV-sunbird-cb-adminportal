import { NgModule } from '@angular/core'
import { CommonModule, DatePipe } from '@angular/common'
import { MarketPlaceDashboardComponent } from './components/market-place-dashboard/market-place-dashboard.component'
import { ProviderDetailsComponent } from './components/provider-details/provider-details.component'
import { RouterModule, Routes } from '@angular/router'
import { ConfigureMarketplaceProvidersComponent } from './components/configure-marketplace-providers/configure-marketplace-providers.component'
import { MatCardModule, MatButtonModule, MatIconModule, MatExpansionModule, MatTabsModule, MatInputModule, MatMenuModule, MatDialogModule, MatTableModule, MatPaginatorModule, MatTooltipModule, MatProgressSpinnerModule, MatCheckboxModule, MatProgressBarModule } from '@angular/material'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BreadcrumbsOrgModule } from '@sunbird-cb/collection'
import { HelpCenterGuideComponent } from './components/help-center-guide/help-center-guide.component'
import { ProvidersComponent } from './components/providers/providers.component'
import { ConformationPopupComponent } from './dialogs/conformation-popup/conformation-popup.component'
import { ContentUploadComponent } from './components/content-upload/content-upload.component'
import { CoursesTableComponent } from './components/courses-table/courses-table.component'
import { CoursesPreviewComponent } from './components/courses-preview/courses-preview.component'
import { DragDropDirective } from './directives/drag-drop.directive'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: MarketPlaceDashboardComponent,
  },
  {
    path: 'onboard-partner',
    pathMatch: 'full',
    component: ConfigureMarketplaceProvidersComponent,
    data: {
      pageId: 'app/home/marketplace-providers/onboard-partner',
      module: 'MarketplaceProvider',
      pageType: 'feature',
      pageKey: 'onBoardPartner',
    },
  },
  {
    path: 'course-preview',
    pathMatch: 'full',
    component: CoursesPreviewComponent,
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
    CoursesPreviewComponent,
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
    MatTooltipModule
  ],
  providers: [DatePipe],
  entryComponents: [
    ConformationPopupComponent
  ],
  exports: [RouterModule],
})
export class MarketplaceProviderModule { }
