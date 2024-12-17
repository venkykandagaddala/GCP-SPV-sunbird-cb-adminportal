import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ContactHomeComponent } from './components/contact-home.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatToolbarModule } from '@angular/material/toolbar'
import { BtnPageBackModule } from '@sunbird-cb/collection'

@NgModule({
  declarations: [ContactHomeComponent],
  imports: [CommonModule, MatToolbarModule, MatCardModule, BtnPageBackModule, MatButtonModule],
  exports: [ContactHomeComponent],
})
export class ContactModule { }
