/* ***************************************************************************
 * Comunicate with psws so:
 *   - url is standar and will be readed from AppConfigService
 *   - data send/recibed must be JSON
 * The only exception is method remoteGet that can be used to pass an URL
 *    Though to read json files directly
 *
 * this Methods filter html and process error so always return a json
 *      (format IResponsePsWS.datos) or
 *      throw an Observable error
 *
 *  ATENTION:
 *      sid is used to save php sessions so youy must not use it out here
 *****************************************************************************/

import { Injectable, Injector } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
  HttpRequest
} from '@angular/common/http';
import { Observable , Observer, Subject } from 'rxjs';
import { AppConfigService } from '../app-config.service';
// import { URLPathTools } from './class/URLPathTools.class';

export interface IRemoteCallReturnFormat {
  error: {
    code: string;
    desc: string;
  }
  datos ?: any[];
}

export interface IRemoteCallPHPParams {
  php_name: string
  inc_json ?: string;
  sid  ?: string;
  [propName: string] : string;
  // [propName: string] : File;
}
export interface upDownLoadProgressRespones {
  kbyteUpDown: number;
  kbyteTotal: number;
}

interface ISubjets {
  progress: Subject<upDownLoadProgressRespones>;
  complete: Subject<any>;
  error: Subject<string>;

  get: Subject<any>;
  post: Subject<any>;
  put: Subject<any>;
  delete: Subject<any>;

}

@Injectable({
  providedIn: 'root'
})
export class RemoteCallService {
  private _sid;       // PHP Sesion id
  protected headers = new HttpHeaders().set(
    'Content-Type', 'application/json',
    // 'responseType', 'json'
    // 'Access-Control-Allow-Origin': '*'
  );
  private PsWSSubjects: ISubjets = {
    get: null,
    post: null,
    put: null,
    delete: null,
    progress: null,
    complete: null,
    error: null
  };
  protected HttpS;
  private sanitizer;
  private AppConfig;

  // ===========================================================================
  // ---------------------------------------------------------------------------

  constructor(
    protected InjectorS: Injector
  ) {

    // Inject dependencies
    this.HttpS = this.InjectorS.get(HttpClient);
    this.sanitizer = this.InjectorS.get(DomSanitizer);
    this.AppConfig = this.InjectorS.get(AppConfigService);

    for ( let sub in this.PsWSSubjects) {
      this.PsWSSubjects[sub] = new Subject();
    }
  }

  // ---------------------------------------------------------------------------

  get onGet(): any {
    return this.PsWSSubjects.get.asObservable();
  }
  get onPost(): Observable<IRemoteCallReturnFormat> {
    return this.PsWSSubjects.post.asObservable();
  }
  get onPut(): Observable<IRemoteCallReturnFormat> {
    return this.PsWSSubjects.put.asObservable();
  }
  get onDelete(): Observable<IRemoteCallReturnFormat> {
    return this.PsWSSubjects.delete.asObservable();
  }

  get onProgress(): Observable<upDownLoadProgressRespones> {
    return this.PsWSSubjects.progress.asObservable();
  }
  get onDownloadProgress(): Observable<upDownLoadProgressRespones> {
    return this.onProgress;
  }
  get onUploadProgress(): Observable<upDownLoadProgressRespones> {
    return this.onProgress;
  }
  get onComplete(): Observable<IRemoteCallReturnFormat> {
    return this.PsWSSubjects.complete.asObservable();
  }
  get onError(): any {
    return this.PsWSSubjects.error.asObservable();
  }

  // ---------------------------------------------------------------------------
  get getSubject(): Subject<any> {
    return this.PsWSSubjects.get;
  }
  get postSubject(): Subject<any> {
    return this.PsWSSubjects.post;
  }
  get putSubject(): Subject<any> {
    return this.PsWSSubjects.put;
  }
  get deleteSubject(): Subject<any> {
    return this.PsWSSubjects.delete;
  }

  get progressSubject(): Subject<any> {
    return this.PsWSSubjects.progress;
  }
  get completeSubject(): Subject<any> {
    return this.PsWSSubjects.complete;
  }
  get errorSubject(): Subject<any> {
    return this.PsWSSubjects.error;
  }

  // ---------------------------------------------------------------------------
  get psws_url(): string {
    // return this.sanitizer.bypassSecurityTrustUrl(this.AppConfig.remoteWS);
    // return this.sanitizer.bypassSecurityTrustHtml(this.AppConfig.serverURL);
    return this.AppConfig.remoteWS;

  }

  get psws_server_base(): string {
    // return this.sanitizer.bypassSecurityTrustUrl(this.AppConfig.remoteWS);
    // return this.sanitizer.bypassSecurityTrustHtml(this.AppConfig.serverURL);
    return this.AppConfig.serverURL;

  }

  // ---------------------------------------------------------------------------

  public remotePost(post_data: IRemoteCallPHPParams): void {
    const self = this;
    const url  = this.psws_server_base + '/' + post_data.php_name + '.php';
    self.HttpS.post(url, post_data, {'headers': self.headers}).subscribe(
        (response: IRemoteCallReturnFormat) => {
          self.responseHandler(response, this.postSubject);
        },
        (e: HttpErrorResponse) => {
          self.HTMLerrorHandler(e, this.postSubject);
        }
    );
  }

  // ---------------------------------------------------------------------------
  //  Like PsWSGet but linking event progress, complete, etc
  //  usefull to upload files
  // Use a FormDate object as param because we need to treat files
  // To link onProgress/OnComplet you must subscribe onProgress, onComplete ( see getters)
  // Is the only mthod than not returna Observable
  public remotePostRequest(end_point_name: string, post_data: FormData): void {
    const self = this;

    // const fu_headers = new HttpHeaders()

    const url  = this.psws_server_base + '/' + end_point_name + '.php';
    const postRequest = new HttpRequest('POST', url, post_data, {
      // headers: fu_headers,
      reportProgress: true,
      // params: post_data,
      responseType: 'json'
    });

    this.HttpS.request(postRequest).subscribe(
      (event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            // console.log('Request sent!');
            break;
          case HttpEventType.ResponseHeader:
            // console.log('Response header received!');
            break;
          case HttpEventType.DownloadProgress:
          case HttpEventType.UploadProgress:
            const kbLoaded = Math.round(event.loaded / 1024);
            const ret_data: upDownLoadProgressRespones = {
              kbyteUpDown: Math.round(event.loaded / 1024),
              kbyteTotal: Math.round(event.total / 1024)
            }
            this.PsWSSubjects.progress.next(ret_data)
            break;
          case HttpEventType.Response:
            // console.log(event.body);
            this.PsWSSubjects.complete.next(event.body);
            // console.log('😺 Done!', event.body);
        }
      },

      (error_HTML: HttpErrorResponse) => self.HTMLerrorHandler(error_HTML, this.errorSubject)
    );

  }

  private responseHandler( response: IRemoteCallReturnFormat,  obs: Observer<any> ) {
    // Errors => 1000 are critical errors
    try {
      if ( response.error.code && parseInt(response.error.code) !== 0) {
        // obs.error(response.error.texto);
        this.PsWSSubjects.error.next(response.error.desc);
      } else {
        obs.next(JSON.parse(response.datos.toString()));
      }
    } catch(e) {

    }

  }

  // ---------------------------------------------------------------------------

  private HTMLerrorHandler( HTMLerror: HttpErrorResponse,  obs?: Observer<any> | Subject<any>) {
    let msg_error_html =
        '<h4>' + HTMLerror.message + '</h4>' +
        ( HTMLerror.error.error ?
          '<div><p>' + HTMLerror.error.error.message + '</p>' +
            HTMLerror.error.text +
          '</div>' :
          '<div><p>' + HTMLerror.error + '</p>' +
            HTMLerror.error.statusText +
          '</div>'
        )
    ;
    // On error the subjects are automatically disabled so
    //   we have to reinit them
    // this.PsWSSubjects.progress = new Subject();
    // this.PsWSSubjects.complete = new Subject();

    console.error('PsWS::remoteGet' + msg_error_html);
    // obs.error(msg_error_html);
    this.PsWSSubjects.error.next(msg_error_html);

  }

}
