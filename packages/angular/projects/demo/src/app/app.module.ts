import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataDenAngularModule } from '../../../data-den-angular/src/lib/data-den-angular.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, DataDenAngularModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
