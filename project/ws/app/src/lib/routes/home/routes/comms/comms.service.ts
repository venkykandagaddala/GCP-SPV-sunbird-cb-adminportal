import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ConfigurationsService } from '@sunbird-cb/utils'

@Injectable({
  providedIn: 'root'
})
export class CommsService {

  COMMS_REPORTS = '/apis/proxies/v8/storage/v1/spvReportInfo'

  constructor(private configSvc: ConfigurationsService,
    private http: HttpClient) { }

  getCommsContent() {
    return this.http.get<any>(`${this.configSvc.baseUrl}/feature/comms.json`)
  }

  getCommsReportContnet() {
    return this.http.get<any>(this.COMMS_REPORTS)
  }

}
