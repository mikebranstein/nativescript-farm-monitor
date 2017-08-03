import { Component, OnInit, NgZone } from "@angular/core";
import { Location } from "@angular/common";
import { RouterExtensions } from "nativescript-angular/router";

import { WidgetBase } from "../widget-base";

import { MomentaryWeather } from "../../../models/momentaryWeather";
import { WeatherService } from "../../../services/weather.service";
import { CouchbaseService } from "../../../services/couchbase.service";

@Component({
    selector: "ns-soil-moisture-widget",
    moduleId: module.id,
    templateUrl: "./soil-moisture-widget.component.html",
    styleUrls: ["../widget-base.css", "./soil-moisture-widget.component.css"]
})
export class SoilMoistureWidgetComponent extends WidgetBase implements OnInit {

    constructor(
        ngZone: NgZone,
        location: Location,
        routerExtensions: RouterExtensions,
        weatherService: WeatherService, 
        couchbaseService: CouchbaseService) { 
            super(ngZone, location, routerExtensions, weatherService, couchbaseService);

            this.registerDbChangeListenerAction(this.updateSoilMoisture);
        }

    // called by base widget class when the current weather database
    // has a changed document
    private updateSoilMoisture(data: MomentaryWeather): void {
        if (data) {
            this.value = data.SoilMoisture;
        }
        else {
            this.value = 0;
        }
    }
}