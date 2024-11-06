import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core'

@Component({
  selector: 'ws-app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.scss'],
})
export class ProvidersComponent implements OnInit {

  @Input() cardDetails: any
  @Input() cardTheme = ''
  @Output() buttonActions = new EventEmitter<any>()

  @ViewChild('provider', { static: true }) providerTemplate!: TemplateRef<any>

  constructor(
  ) { }

  ngOnInit() {
  }

  buttonClick(action: string, mode?: string) {
    const event = {
      action,
      mode,
    }
    this.buttonActions.emit(event)
  }

}
