import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { AppRoutingModule } from "./app.routing";
import { AppComponent } from "./app.component";

import { WeatherService } from "./services/weather.service";
import { CouchbaseService } from "./services/couchbase.service";
import { InitComponent } from "./views/init/init.component";
import { HomeComponent } from "./views/home/home.component";
import { WindComponent } from "./views/wind/wind.component";

import { NativeScriptUIChartModule } from "nativescript-telerik-ui-pro/chart/angular";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptHttpModule,
        NativeScriptUIChartModule
    ],
    declarations: [
        AppComponent,
        InitComponent,
        HomeComponent,
        WindComponent
    ],
    providers: [
        WeatherService,
        CouchbaseService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
