import { Component, OnInit, NgZone } from "@angular/core";
import { Location } from "@angular/common";
import { RouterExtensions } from "nativescript-angular/router";

import { WidgetBase } from "../widget-base";

import { MomentaryWeather } from "../../../models/momentaryWeather";
import { WeatherService } from "../../../services/weather.service";
import { CouchbaseService } from "../../../services/couchbase.service";

@Component({
    selector: "ns-wind-widget",
    moduleId: module.id,
    templateUrl: "./wind-widget.component.html",
    styleUrls: ["../widget-base.css", "./wind-widget.component.css"]
})
export class WindWidgetComponent extends WidgetBase implements OnInit {

    windDirection: any;

    constructor(
        ngZone: NgZone,
        location: Location,
        routerExtensions: RouterExtensions,
        weatherService: WeatherService, 
        couchbaseService: CouchbaseService) { 
            super(ngZone, location, routerExtensions, weatherService, couchbaseService);

            this.registerDbChangeListenerAction(this.updateWind);
        }

    // called by base widget class when the current weather database
    // has a changed document
    private updateWind(data: MomentaryWeather): void {
        if (data) {
            this.value = data.WindSpeedMPH;
            this.windDirection = this.weatherService.convertRadiansToCardinalDirection(data.WindDirection);
        }
        else {
            this.value = 0.0;
            this.windDirection = "N";
        }
    }

}