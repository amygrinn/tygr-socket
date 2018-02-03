import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { TygrModule } from '@tygr/core';
import { SocketModule } from '@tygr/socket';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    TygrModule,
    SocketModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
