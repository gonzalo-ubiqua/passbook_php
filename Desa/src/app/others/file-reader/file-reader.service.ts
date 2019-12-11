import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileReaderService {
  private static instances: FileReaderService[] = [];

  private procesing_file: File = null;
  private Reader: FileReader = null;

  private progress_sub  = new Subject<number>();
  private loadstart_sub = new Subject<string>();
  private loadend_sub   = new Subject<string>();
  private error_sub     = new Subject<string>();

  public onProgress = this.progress_sub.asObservable();
  public onLoadStart= this.loadstart_sub.asObservable();
  public onLoadEnd  = this.loadend_sub.asObservable();
  public onError    = this.error_sub.asObservable();

  public subs = {
    bg: null as Subscription,
    pr: null as Subscription,
    en: null as Subscription,
    er: null as Subscription,
  }

// ===========================================================================
// ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  get instances_list() {

    return FileReaderService.instances;

  }

  // ---------------------------------------------------------------------------
  get current_File() {

    return this.procesing_file;

  }

  // ===========================================================================
  // ---------------------------------------------------------------------------
  public static getNew(): FileReaderService {
    const new_instance = new FileReaderService();

    FileReaderService.instances.push(new_instance);

    return new_instance;

  }

  // ---------------------------------------------------------------------------
  public static deleteInstances(instance_to_delete: FileReaderService) {

    FileReaderService.instances = FileReaderService.instances.filter( (e:FileReaderService) => e !==  instance_to_delete);

  }

  // ---------------------------------------------------------------------------
  public static cleanInstances() {

    FileReaderService.instances = [];

  }

  // ===========================================================================
  public readFile(file: File): void {
    const me = this;

    this.procesing_file = file;

    this.Reader = new FileReader();
    this.Reader.onloadstart = () => {
      me.loadstart_sub.next(this.procesing_file.name);
    }
    this.Reader.onloadend = () => {
      me.loadend_sub.next(this.Reader.result.toString());
    }
    this.Reader.onprogress = (e) => {
      me.progress_sub.next( Math.round( (e.loaded/e.total)*100 ) ) ;
    }
    this.Reader.onerror = (e) => {
      me.error_sub.next(e.toString());
    }

   // this.Reader.readAsText(this.procesing_file);
   this.Reader.readAsBinaryString(this.procesing_file);

  }

}
