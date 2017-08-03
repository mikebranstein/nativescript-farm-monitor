import { Component, OnInit, NgZone } from "@angular/core";
import { Location } from "@angular/common";
import { RouterExtensions } from "nativescript-angular/router";

import { WidgetBase } from "../widget-base";

import { MomentaryWeather } from "../../../models/momentaryWeather";
import { WeatherService } from "../../../services/weather.service";
import { CouchbaseService } from "../../../services/couchbase.service";

@Component({
    selector: "ns-humidity-widget",
    moduleId: module.id,
    templateUrl: "./humidity-widget.component.html",
    styleUrls: ["../widget-base.css", "./humidity-widget.component.css"]
})
export class HumidityWidgetComponent extends WidgetBase implements OnInit {

    constructor(
        ngZone: NgZone,
        location: Location,
        routerExtensions: RouterExtensions,
        weatherService: WeatherService, 
        couchbaseService: CouchbaseService) { 
            super(ngZone, location, routerExtensions, weatherService, couchbaseService);

            this.registerDbChangeListenerAction(this.updateHumidity);
        }

    // called by base widget class when the current weather database
    // has a changed document
    private updateHumidity(data: MomentaryWeather): void {
        if (data) {
            this.value = data.Humidity;
        }
        else {
            this.value = 0.0;
        }
    }
}