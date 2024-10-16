import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'ws-app-help-center-guide',
  templateUrl: './help-center-guide.component.html',
  styleUrls: ['./help-center-guide.component.scss'],
})
export class HelpCenterGuideComponent implements OnInit {

  @Input() helpCenterGuide: any

  showTopSection = false
  playVideo = false

  constructor() { }

  ngOnInit() {
  }

  openVideoPopup() { }

  callResizeEvent(_event: any) {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    },         100)
  }

}
