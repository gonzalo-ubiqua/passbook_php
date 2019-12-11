import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService implements CanActivate {
  private login_data = null;

  constructor(
    // protected injector: Injector,
    // protected AppConfigSS: AppConfigService,
    private Route: Router) { }

  // ===========================================================================
  public canActivate() {
    if (this.loginValido()) {
      return true;
    }
    this.Route.navigate(['/login']);
    return false;
  }

  // ---------------------------------------------------------------------------
  public loginValido() {
    const login_data = localStorage.getItem('datalogin');
    return (login_data !== null);
  }

  // ---------------------------------------------------------------------------
  public afteLoginValido(login_data) {
    // this.login_data = login_data;
    localStorage.setItem('datalogin', JSON.stringify(login_data));
    this.Route.navigate(['home']);
  }

  // ---------------------------------------------------------------------------
  public logout() {
    this.login_data = null;
    localStorage.setItem('datalogin', null);
    this.Route.navigate(['login']);
  }
}
