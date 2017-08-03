import { Component, OnInit, NgZone } from "@angular/core";
import { Location } from "@angular/common";
import { RouterExtensions } from "nativescript-angular/router";

import { WidgetBase } from "../widget-base";

import { MomentaryWeather } from "../../../models/momentaryWeather";
import { WeatherService } from "../../../services/weather.service";
import { CouchbaseService } from "../../../services/couchbase.service";

@Component({
    selector: "ns-pressure-widget",
    moduleId: module.id,
    templateUrl: "./pressure-widget.component.html",
    styleUrls: ["../widget-base.css", "./pressure-widget.component.css"]
})
export class PressureWidgetComponent extends WidgetBase implements OnInit {

    constructor(
        ngZone: NgZone,
        location: Location,
        routerExtensions: RouterExtensions,
        weatherService: WeatherService, 
        couchbaseService: CouchbaseService) { 
            super(ngZone, location, routerExtensions, weatherService, couchbaseService);

            this.registerDbChangeListenerAction(this.updatePressure);
        }

    // called by base widget class when the current weather database
    // has a changed document
    private updatePressure(data: MomentaryWeather): void {
        if (data) {
            this.value = data.Pressure;
        }
        else {
            this.value = 0.0;
        }
    }
}