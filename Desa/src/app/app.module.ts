import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { ReactiveFormsModule } from '@angular/forms';

// import { AppRoutingModule } from './app-routing.module';
import { OthersModule } from './others/others.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PageLoginComponent } from './page-login/page-login.component';
import { PageHomeComponent } from './page-home/page-home.component';
import { CsvUploadComponent } from './csv-upload/csv-upload.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageLoginComponent,
    PageHomeComponent,
    CsvUploadComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    OthersModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
