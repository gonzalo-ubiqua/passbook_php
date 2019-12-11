import { Injectable } from '@angular/core';
import { DomSanitizer, SafeScript } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private GenericInfo = {
    html_title      : 'Cortijo Fontanilla',            // => For meta Title
    app_title       : 'Cortijo Fontanilla',    // => generic app title
    logo            : '', // 'logo.jpg',                       // in assets/imgs
    logo_screen     : 'logo-pantalla.jpg',                       // in assets/imgs
    logo_footer     : '',
    client_data     : {
      name          : 'Cortijo Fontanilla',
      address       : '',
      zip_code      : '',
      city          : '',
      state         : '',
      nif           : '',
      telefono      : '',
      email         : 'gonzalo@ubiqua.com',
      iban          : '',
    }
  };


  // --------------------------------------------------------------------------
  private login_config = {
    title_login      : 'Registro',
    after_login_path : '/home',
    presistant       : true,
    timeout          : 0              // time to auto logout (0 = no auto logout)
  };

  // --------------------------------------------------------------------------
  private servers = {
    localhost: {
      url : 'http://trabajo.petrasoft.es/dev/passbook-mailing/Dist/server',
      ws  : '/php/ajax/psws.php',
    },
    'trabajo.petrasoft.es': {
      url : '//trabajo.petrasoft.es/dev/passbook-mailing/Dist/server',
      ws  : '/php/ajax/psws.php',
    },
    default: {
      url : 'server',
      ws  : '/php/ajax/psws.php',
    }
  }

  // --------------------------------------------------------------------------
  private db_config = {
    // localhost: {},
    default: {
      type      : 'mysql',
      tipo_bool	: 'n'
    }
  }

  // private webSercice_path = '/php/ajax/psws.php';
  private json_config = {
    url : '',             // '' => same that server.url (serverURL)
    path: 'json'
  };

  // ==========================================================================
  // ==========================================================================

  constructor( private DOMS: DomSanitizer) { }

  // --------------------------------------------------------------------------

  get metaTitle(): string {
    return this.GenericInfo.html_title;
  }
  get appTitle(): string {
    return this.GenericInfo.app_title;
  }
  get clientLogo(): string {
    return this.GenericInfo.logo;
  }
  get clientScreenLogo(): string {
    return this.GenericInfo.logo_screen;
  }
  get clientLogoFooter(): string {
    return this.GenericInfo.logo_footer;
  }
  get clientData(): {[propName: string]: string} {
    return this.GenericInfo.client_data;
  }

  // --------------------------------------------------------------------------

  get afertLoginPath(): string {
    return this.login_config.after_login_path;
  }
  get pageLoginTitle(): string {
    return this.login_config.title_login ? this.login_config.title_login : this.appTitle;
  }
  get persistantLogin(): boolean {
    return this.login_config.presistant;
  }
  get logoutTime(): number {
    return this.login_config.timeout;
  }

  // --------------------------------------------------------------------------
  get serverURL(): string {
    // return this.server_url;
    // return this.server.url;
    let server = this.servers.default;
    if ( this.servers[location.hostname]) {
      if ( this.servers[location.hostname].port ) {
        if ( location.port === this.servers[location.hostname].port ) {
          server = this.servers[location.hostname];
        } else {} // leave default server
      } else {
        server = this.servers[location.hostname];
      }
    }
    return server.url;
  }

  get wsPath(): string {
    let server = this.servers.default;
    if ( this.servers[location.hostname]) {
      server = this.servers[location.hostname];
    }
    return server.ws;
  }

  get remoteWS(): string {
    // return this.serverURL + '/' + this.webSercice_path;
    return this.serverURL + this.wsPath;
  }

  // --------------------------------------------------------------------------
  get DBType(): string {
    let db = this.db_config.default;
    if ( this.db_config[location.hostname]) {
      db = this.db_config[location.hostname];
    }
    return db.type;
  }

  get DBBoolType(): string {
    let db = this.db_config.default;
    if ( this.db_config[location.hostname]) {
      db = this.db_config[location.hostname];
    }
    return db.tipo_bool;
  }

  // --------------------------------------------------------------------------
  get jsonServe(): SafeScript {
    this.json_config.url = this.json_config.url === '' ? this.serverURL : this.json_config.url;
    // return this.DOMS.bypassSecurityTrustResourceUrl(this.json_config.url);
    return this.json_config.url;
  }
  get jsonURL(): SafeScript {
    this.json_config.url = this.json_config.url === '' ? this.serverURL : this.json_config.url;
    // return this.DOMS.bypassSecurityTrustScript(this.json_config.url + '/' + this.json_config.path);
    return this.json_config.url + '/' + this.json_config.path;
  }

}
