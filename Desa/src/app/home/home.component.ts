import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FileReaderAbstractComponent } from '../others/file-reader/file-reader-abstract.component';
import { FileSendService } from '../others/file-reader/file-send.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: [
    '../others/msg-window/style.scss',
    './home.component.scss'
  ]
})
export class HomeComponent extends FileReaderAbstractComponent implements OnInit, OnDestroy {
  public window_ind   = 0;
  public msg_error    = '';
  public upload_log   = null;
  public uploading_files: any[] = [];
  public stadistics = null;

  private FileSendS: FileSendService = null
  private sb = {
    e: null as Subscription,
    w: null as Subscription,
  }
  // ===========================================================================
  // ---------------------------------------------------------------------------
  constructor(private InjectorS: Injector) {
    super();

    this.FileSendS = InjectorS.get(FileSendService);

  }

  // ---------------------------------------------------------------------------
  ngOnInit() {

    this.clean();         // Clean FileReaderAbstractComponent
    this.window_ind       = 0;
    this.uploading_files  = [];
    this.FileSendS.onProgress.subscribe( (info: any) => {
      console.log("Filesend onProgress");
      console.info(info);
    });
    this.FileSendS.onComplete.subscribe( (info: any) => {
      console.log("Filesend onComplete");
      console.info(info);
      this.stadistics = JSON.parse(info.datos);
        // this.upload_log = log;
      this.window_ind = 3;
      // this.uploading_files = this.uploading_files.filter( (e:File) => e.name !== log.file_name);
      this.uploading_files = [];    // Solo se permite subi un fochero cada vez así que es válido inicilizar this.uploading_files
    });

    this.sb.e = this.FileSendS.onError.subscribe( (error: string) => {
      this.uploading_files = [];
      this.msg_error  = error;
      this.window_ind = 99;
    });

  }

  // ---------------------------------------------------------------------------
  ngOnDestroy() {

    for ( let s in this.sb) {
      this.sb[s] && this.sb[s].unsubscribe();
    }

  }

  private sendtoServer(file: File, data:string) {

    this.uploading_files.push(file);
    this.window_ind = 2;
    this.FileSendS.send(file.name, data);

  }

  // ===========================================================================
  // File reader implementions
  // ---------------------------------------------------------------------------
  protected afterReaderBegin() {

    this.window_ind = 1;

  }

  // ---------------------------------------------------------------------------
  protected afterReaderProgress() {

    this.window_ind = 1;

  }
  // ---------------------------------------------------------------------------
  protected afterReaderFinish(file: File, readed_data: string) {

    this.window_ind = 0;
    try {
      // Validate CSV format
      const parts = file.name.split('.');
      const ext   = parts.pop();
      if ( ext != 'csv' ) {
        throw new Error()
      }
      // const json_readed_data = JSON.parse(readed_data);
      // console.info(json_readed_data);
      this.sendtoServer(file, readed_data);

    } catch(e) {
      this.msg_error  = "Error el fichero subido no es un csv. ";
      this.window_ind = 99; // JSON error

    }

  }

  // ---------------------------------------------------------------------------
  protected afterReaderError(e: string) {

    this.msg_error = e;
    this.window_ind = 99;

  }

}
