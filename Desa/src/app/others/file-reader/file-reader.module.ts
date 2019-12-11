/*
 *
 *     Tratamiento:
 *     importar el modulo file-reader.module
 *     Crear un component que extienda file-reader-abstract.component
 *        (debe implementar una serie de metodos)
 *        Como ejemplo: file-reader.component (con us html y css)
 *
 */


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileReaderComponent } from "./ejemplo/file-reader.component";
import { FileReaderService } from "./file-reader.service";
import { FileSendService } from "./file-send.service";

@NgModule({
  declarations: [FileReaderComponent],
  imports: [
    CommonModule
  ],
  exports: [
    FileReaderComponent
  ],
  providers: [
    FileReaderService, FileSendService
  ],
})
export class FileReaderModule { }
