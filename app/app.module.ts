import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { AppRoutingModule } from "./app.routing";
import { AppComponent } from "./app.component";

import { WeatherService } from "./services/weather.service";
import { CouchbaseService } from "./services/couchbase.service";
import { InitComponent } from "./views/init/init.component";
import { DashboardComponent } from "./views/dashboard/dashboard.component";
import { HumidityWidgetComponent } from "./views/widgets/humidity/humidity-widget.component";
import { TemperatureWidgetComponent } from "./views/widgets/temperature/temperature-widget.component";
import { PressureWidgetComponent } from "./views/widgets/pressure/pressure-widget.component";
import { SoilTemperatureWidgetComponent } from "./views/widgets/soil-temperature/soil-temperature-widget.component";
import { SoilMoistureWidgetComponent } from "./views/widgets/soil-moisture/soil-moisture-widget.component";
import { WindWidgetComponent } from "./views/widgets/wind/wind-widget.component";
import { RainWidgetComponent } from "./views/widgets/rain/rain-widget.component";

import { TemperatureComponent } from "./views/temperature/temperature.component";

import { TNSFontIconModule } from 'nativescript-ng2-fonticon';

import { NativeScriptUIChartModule } from "nativescript-telerik-ui-pro/chart/angular";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptHttpModule,
        NativeScriptUIChartModule,
        TNSFontIconModule.forRoot({
			'fa': './assets/font-awesome.min.css'
		})
    ],
    declarations: [
        AppComponent,
        InitComponent,
        DashboardComponent,
        HumidityWidgetComponent,
        TemperatureWidgetComponent,
        PressureWidgetComponent,
        SoilTemperatureWidgetComponent,
        SoilMoistureWidgetComponent,
        WindWidgetComponent,
        RainWidgetComponent,
        TemperatureComponent
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
