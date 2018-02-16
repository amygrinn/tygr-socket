import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { TygrModule } from '@tygr/core';
import { SocketModule } from '@tygr/socket';

import { AppComponent } from './app.component';

import { tygrConfig } from '../config/tygr.config';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    TygrModule.forRoot(tygrConfig),
    SocketModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
