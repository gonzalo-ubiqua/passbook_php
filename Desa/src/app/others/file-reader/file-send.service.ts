import { Injectable, Injector } from '@angular/core';
// import { PsWS2Service, IRemoteCallParams } from '../ps/PsWS-v2.service';
import { RemoteCallService, IRemoteCallPHPParams} from '../../services/remote-call.service';  // Only for type definition


@Injectable({
  providedIn: 'root'
})
export class FileSendService extends RemoteCallService {
  protected remoteCallParams: IRemoteCallPHPParams = {
    php_name: 'sendMailind',
    File: null

  };
  protected metadata_filename: string = '';

  // ===========================================================================
  // ---------------------------------------------------------------------------
  constructor(protected InjectorS: Injector) {
    super(InjectorS);

  }

  // ---------------------------------------------------------------------------
  // get psws_url(): string {
  //   return this.psws_server_base + '/php/prueba_progress.php';
  //
  // }

  // ===========================================================================
  // ---------------------------------------------------------------------------
  public send(file_name: string, content_to_send: string): void {
    const data = new FormData();
    data.append('file_name', file_name);
    data.append('content', content_to_send);
    this.remotePostRequest('mailingSCV', data);


    // const callParams = this.getCallParams('SendData');
    // callParams.params = JSON.stringify({
    //   file_name: file_name,
    //   content: content_to_send
    // });
    //
    // this.remotePostRequest(callParams)

    // .subscribe(
    //   // (r: any) => this.bkl_Subjects.rowWritten.next( this.asObj(r, this.metadata.datos) )
    //     (r: any) =>
    //       // this.sendDataReturn(r,this.bkl_Subjects.rowWritten, false
    //       {}
    //     )
    // );



    // Intento  con progress

    // console.log(callParams);
    //
    // const data = new FormData();
    // for (let name in callParams) {
    //   // console.log(" - " + name + ': ' + callParams[name]);
    //   data.set(name, callParams[name]);
    // }
    // // console.log(data);
    // // data.append('content', content_to_send);
    // //
    // this.remotePostRequest(data)














    //
    //
    //
    //
    // const send_info: IRemoteCallParams = {
    //   clase : null,
    //   metodo: 'prueba_progress',
    //   token:
    //   params: JSON.stringify({
    //     content: content_to_send
    //   })
    // }
    // if ( this.sid ) {
    //   send_info.sid = this.sid;
    // }
    //
    // this.HttpS.post(this.psws_url, send_info, {'headers': this.headers}).subscribe(
    //     (response: any) => {
    //       // this.PsResponseHandler(response, obs);
    //       console.log(response);
    //     },
    //     (e: any) => {
    //       // this.HTMLerrorHandler(e, obs);
    //       console.error(e.error.text);
    //     }
    // );

  }

}
