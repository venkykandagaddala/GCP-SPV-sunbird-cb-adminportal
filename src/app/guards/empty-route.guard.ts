import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { ConfigurationsService } from '@sunbird-cb/utils'

@Injectable({
  providedIn: 'root',
})
export class EmptyRouteGuard  {
  constructor(
    private router: Router,
    private configSvc: ConfigurationsService,
    // private authSvc: AuthKeycloakService,
    // private activateRoute: ActivatedRoute
  ) { }
  canActivate(
    _next: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.configSvc.userProfile && this.configSvc.userProfile.userId) {
      return this.router.parseUrl('/app/home')
    }
    return false
  }
}
