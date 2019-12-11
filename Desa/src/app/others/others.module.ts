import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from "../app-routing.module";

import { MaterialModule } from "./material.module";
import { FileReaderModule } from './file-reader/file-reader.module';
import { BtnLoadingDirective }    from './directives/btn-loading.directive';
import { HTML5DropableDirective } from './directives/HTML5Drop.directive';

@NgModule({
  declarations: [
    BtnLoadingDirective,
    HTML5DropableDirective
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    FileReaderModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    AppRoutingModule,
    BtnLoadingDirective,
    CommonModule,
    FormsModule,
    HTML5DropableDirective,
    MaterialModule,
    ReactiveFormsModule,

    BtnLoadingDirective,

  ],
})
export class OthersModule { }
