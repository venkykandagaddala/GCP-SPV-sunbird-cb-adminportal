import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'

@Injectable()
export class ApprovedlistResolve
   {
  requestType: any
  url: any
  constructor(private http: HttpClient) { }
  resolve(): Observable<any> {
    const reqArray = window.location.pathname.split('requests/')
    this.requestType = reqArray[1]
    this.url = '/apis/proxies/v8/user/v1/positions'
    if (this.requestType && this.requestType === 'designation') {
      return this.http.get(this.url).pipe(
        map((datanew: any) => ({
          data: datanew.responseData, error: null,
        })),
        catchError(error => of({ error, data: null })),
      )
    }
    return of(null)
  }
}
