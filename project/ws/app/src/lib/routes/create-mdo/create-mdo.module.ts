import { NgModule } from '@angular/core'
import { CommonModule, DatePipe } from '@angular/common'
import { CreateMDORoutingModule } from './create-mdo-routing.module'
import { HomeComponent } from './routes/home/home.component'
import { BtnPageBackModuleAdmin, LeftMenuModule, GroupCheckboxModule, ScrollspyLeftMenuModule } from '@sunbird-cb/collection'
import { HomeModule } from '../home/home.module'
import { RouterModule } from '@angular/router'
import { UsersComponent } from './routes/users/users.component'
import { UsersService } from './services/users.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import {
  MatExpansionModule, MatSlideToggleModule, MatOptionModule, MatFormFieldModule, MatPaginatorModule,
  MatSelectModule, MatChipsModule, MatDatepickerModule, MatAutocompleteModule,
  MatSidenavModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatListModule,
  MatRadioModule,
  MatDialogModule,
} from '@angular/material'
import { MatCardModule } from '@angular/material/card'
import { RolesAccessComponent } from '../access/routes/roles-access/roles-access.component'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { UIAdminTableModule } from '../../head/ui-admin-table/ui-admin-table.module'
import { MentorManageComponent } from './mentor-manage/mentor-manage.component'
import { SearchComponent } from './search/search.component'
import { UserCardComponent } from './user-cards/user-card.component'
import { AvatarPhotoModule } from './avatar-photo/avatar-photo.module'
import { PipeOrderByModule } from '../home/pipes/pipe-order-by/pipe-order-by.module'
import { LoaderService } from '../home/services/loader.service'

@NgModule({
  declarations: [HomeComponent, UsersComponent, RolesAccessComponent, MentorManageComponent, SearchComponent, UserCardComponent],
  imports: [CommonModule, CreateMDORoutingModule, BtnPageBackModuleAdmin, LeftMenuModule, WidgetResolverModule,
    MatSidenavModule, MatIconModule, MatProgressSpinnerModule, GroupCheckboxModule, HomeModule, RouterModule, UIAdminTableModule, MatCardModule,
    ScrollspyLeftMenuModule, FormsModule, MatSelectModule, MatChipsModule, MatDatepickerModule, MatAutocompleteModule,
    MatExpansionModule, MatSlideToggleModule, MatOptionModule, MatFormFieldModule, MatPaginatorModule, MatListModule, MatRadioModule, MatDialogModule,
    ReactiveFormsModule, PipeOrderByModule, AvatarPhotoModule],
  exports: [UsersComponent, RolesAccessComponent, MentorManageComponent, SearchComponent, UserCardComponent, AvatarPhotoModule],
  providers: [UsersService, LoaderService, DatePipe],
})
export class CreateMDOModule { }
