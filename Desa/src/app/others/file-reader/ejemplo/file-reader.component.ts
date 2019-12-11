import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FileReaderAbstractComponent } from '../file-reader-abstract.component';
import { FileSendService } from '../file-send.service';

@Component({
  selector: 'file-reader',
  templateUrl: './file-reader.component.html',
  styleUrls: ['./file-reader.component.scss']
})
export class FileReaderComponent extends FileReaderAbstractComponent implements OnInit, OnDestroy {
  public window_ind   = 0;
  public msg_error    = '';
  public upload_log   = null;
  public uploading_files: any[] = [];

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
    // this.FileSendS.onProgress.subscribe( (info: any) => {
    //   console.log("Filesend onProgress");
    //   console.info(info);
    // });
    // this.FileSendS.onComplete.subscribe( (info: any) => {
    //   console.log("Filesend onComplete");
    //   console.info(info);
    // });

    this.sb.e = this.FileSendS.onError.subscribe( (error: string) => {
      this.uploading_files = [];
      this.msg_error  = error;
      this.window_ind = 99;
    });

    // this.sb.w = this.FileSendS.onRowWritten.subscribe( (log: any) => {
    //   this.upload_log = log;
    //   this.window_ind = 3;
    //   this.uploading_files = this.uploading_files.filter( (e:File) => e.name !== log.file_name);
    // });

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
      // Validate JSON format
      const json_readed_data = JSON.parse(readed_data);
      // console.info(json_readed_data);
      this.sendtoServer(file, readed_data);

    } catch(e) {
      this.msg_error  = "Error JSON not valid format: " + e;
      this.window_ind = 99; // JSON error

    }

  }

  // ---------------------------------------------------------------------------
  protected afterReaderError(e: string) {

    this.msg_error = e;
    this.window_ind = 99;

  }

}
