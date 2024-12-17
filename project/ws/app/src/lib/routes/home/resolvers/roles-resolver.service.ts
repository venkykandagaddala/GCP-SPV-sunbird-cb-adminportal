import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { IResolveResponse } from '@sunbird-cb/utils'

/* tslint:disable */
import _ from 'lodash'
import { RolesService } from '../services/roles.service'
/* tslint:enable */

@Injectable()
export class RolesResolver
   {
  constructor(private rolesService: RolesService) { }

  resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<IResolveResponse<any>> {
    return this.rolesService.getAllRoles().pipe(
      map(data => ({ data: JSON.parse(_.get(data, 'result.response.value') || '{}'), error: null })),
      catchError(error => of({ error, data: null })),
    )
  }
}
