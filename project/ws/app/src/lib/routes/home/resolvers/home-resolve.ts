import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { } from '@sunbird-cb/collection'
import { ConfigurationsService, IResolveResponse } from '@sunbird-cb/utils'
import { ProfileV2Service } from '../services/home.servive'
import { NSProfileDataV2 } from '../models/profile-v2.model'

@Injectable()
export class HomeResolve
   {
  constructor(private profileV2Svc: ProfileV2Service, private configSvc: ConfigurationsService) { }

  resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<IResolveResponse<NSProfileDataV2.IProfile>> {
    const path = _route.routeConfig && _route.routeConfig.path
    let userId = ''
    if (path !== 'me') {
      userId = _route.params.userId
      if (!userId) {
        userId = _route.queryParams.userId
      }
      if (!userId) {
        userId = this.configSvc.userProfile && this.configSvc.userProfile.userId || ''
      }
    } else {
      userId = this.configSvc.userProfile && this.configSvc.userProfile.userId || ''
    }
    return this.profileV2Svc.fetchProfile(userId).pipe(
      map(data => ({ data, error: null })),
      catchError(error => of({ error, data: null })),
    )
  }
}
