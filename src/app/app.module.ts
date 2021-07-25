import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { IonicStorageModule } from '@ionic/storage-angular';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DEFAULT_TIMEOUT, TimeoutInterceptor } from './services/interceptor.service';
import { OneSignal } from '@ionic-native/onesignal/ngx';

// Modals
import { UpdateSentDataPageModule } from './modals/update-sent-data/update-sent-data.module';
import { DatosBancariosPageModule } from './modals/datos-bancarios/datos-bancarios.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot (),
    AppRoutingModule,
    IonicStorageModule.forRoot (),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    UpdateSentDataPageModule,
    DatosBancariosPageModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    [{ provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true }],
    [{ provide: DEFAULT_TIMEOUT, useValue: 30 * 1000 }],
    OneSignal
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
