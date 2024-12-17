import { ConfigurationsService } from '@sunbird-cb/utils' // AuthKeycloakService
import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class LoginGuard  {
  constructor(
    private router: Router,
    private configSvc: ConfigurationsService,
    // private authSvc: AuthKeycloakService,
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.configSvc.isAuthenticated) {
      if (this.configSvc.instanceConfig && this.configSvc.instanceConfig.keycloak.isLoginHidden) {
        // let redirectUrl = document.baseURI
        // if (next.queryParamMap.has('ref')) {
        //   const ref = decodeURIComponent(next.queryParamMap.get('ref') || '')
        //   redirectUrl += this.router.parseUrl(ref || '')
        // }
        // this.authSvc.login(this.configSvc.instanceConfig.keycloak.defaultidpHint, redirectUrl)
        return false
      }
      return true
    }

    if (next.queryParamMap.has('ref')) {
      const ref = decodeURIComponent(next.queryParamMap.get('ref') || '')
      return this.router.parseUrl(ref || '')
    }
    return this.router.parseUrl('app/home')
  }
}
