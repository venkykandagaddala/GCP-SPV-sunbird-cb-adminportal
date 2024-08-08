import { Component, OnInit } from '@angular/core'
import { environment } from '../../../../../../../../../src/environments/environment'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'ws-app-kcm-mapping',
  templateUrl: './kcm-mapping.component.html',
  styleUrls: ['./kcm-mapping.component.scss'],
})
export class KCMMappingComponent implements OnInit {
  environmentVal: any
  taxonomyConfig: any
  showTopSection = false
  kcmConfig: any
  constructor(
    private activateRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.environmentVal = environment
    this.environmentVal.frameworkName = environment.KCMframeworkName
    // this.environmentVal.url = `https://localhost:3000`
    this.activateRoute.data.subscribe(data => {
      this.kcmConfig = data.pageData.data
      this.kcmConfig.defaultKCMConfig[0].frameworkId = environment.KCMframeworkName
      this.taxonomyConfig = [...this.kcmConfig.defaultKCMConfig, ...this.kcmConfig.frameworkConfig]
    })
  }

  callResizeEvent(_event: any) {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 100)
  }

}
