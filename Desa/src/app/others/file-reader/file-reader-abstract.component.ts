/******************************************************************************
 *  Public property:
 *      file_list => array (type ) of all files being uploades and his progress
 *
 *  Public method:
 *      onFileSelected($event) method to be called when a file is selected by <input type="file" />
 *      clean()  => reset all
 *
 *  Abstract methods:
 *       afterReaderBegin()
 *       afterReaderProgress(pct: number)
 *       afterReaderFinish(readed_data: string)
 *       afterReaderError(e: string )
 *
 ******************************************************************************/


// import { Component, OnDestroy, OnInit } from '@angular/core';
import { FileReaderService } from './file-reader.service';

export interface FileScreenInfo {
  file: File;
  pct_procesed: number;
}
export {FileReaderService};

// @Component({
//   selector: 'file-reader-abs',
//   templateUrl: './file-reader.component.html',
//   styleUrls: []
// })
export abstract class FileReaderAbstractComponent /* implements OnInit, OnDestroy */ {
  public file_list: FileScreenInfo[] = [];

  private current_target: any = null

  // private FileReaderS: FileReaderService = null;
  // ===========================================================================
  // ---------------------------------------------------------------------------
  // constructor(InjectorS) {
  //
  //   // this.FileReaderS = InjectorS.get(FileReaderService);
  //
  // }

  // ===========================================================================
  // ---------------------------------------------------------------------------
  public onFileSelected($event: any) : void {
      let file: File;

      this.current_target = $event.target;
      for (file of $event.target.files) {
        const obj = FileReaderService.getNew();
        this.setSubscriptions(obj);
        obj.readFile(file);
        this.file_list.push({
          file: file,
          pct_procesed: 0
        });
      }

  }

  // ---------------------------------------------------------------------------
  // Sin probar => Probablemente no funcion ok => Ver lo que se para a onFileSelected
  public onDrop(event: any) {

    event.dataTransfer.dropEffect = 'copy';
    this.onFileSelected(event.dataTransfer.files);

  }
  // ---------------------------------------------------------------------------
  public clean() {
    this.file_list      = [];
    this.current_target = null;
    FileReaderService.cleanInstances();
  }

  // ---------------------------------------------------------------------------
  protected abstract afterReaderBegin(): void;
  protected abstract afterReaderProgress(pct: number): void;
  protected abstract afterReaderFinish(file: File, readed_data: string): void;
  protected abstract afterReaderError(e: string): void;

  // ===========================================================================
  // ---------------------------------------------------------------------------
  private afterBeginAbs() {
    this.afterReaderBegin();
  }

  // ---------------------------------------------------------------------------
  protected afterProgressAbs(obj: FileReaderService, pct: number) {
    const current = this.file_list.find( (e:FileScreenInfo) => e.file==obj.current_File);

    if ( current ) {
      current.pct_procesed = pct;
    }

    this.afterReaderProgress(pct);

  }
  // ---------------------------------------------------------------------------
  protected afterFinishAbs(obj: FileReaderService, readed_data: string) {

    this.uploadFinish(obj);
    this.afterReaderFinish(obj.current_File, readed_data);

  }

  // ---------------------------------------------------------------------------
  protected afterErrorAbs(obj: FileReaderService , e?: string ) {

    this.uploadFinish(obj);
    this.afterReaderError(e);

  }

  // ===========================================================================
  // ---------------------------------------------------------------------------
  private setSubscriptions(obj: FileReaderService): void {

    obj.subs.bg = obj.onLoadStart.subscribe( () => this.afterBeginAbs());
    obj.subs.pr = obj.onProgress.subscribe ( (pct: number) => this.afterProgressAbs(obj, pct));
    obj.subs.en = obj.onLoadEnd.subscribe  ( (readed_data:string) => this.afterFinishAbs(obj, readed_data));
    obj.subs.er = obj.onError.subscribe    ( (e: string) => this.afterErrorAbs(obj, e));

  }

  // ---------------------------------------------------------------------------
  private unsetSubscriptions(obj: FileReaderService): void {

    for ( let s in obj.subs) {
      obj.subs[s] && obj.subs[s].unsubscribe();
    }

  }

  // ---------------------------------------------------------------------------
  private uploadFinish(obj: FileReaderService): void {

    this.unsetSubscriptions(obj);
    this.current_target.value = null;
    // Remove form files_list
    this.file_list = this.file_list.filter( (e:FileScreenInfo) => e.file !== obj.current_File)

  }

}
