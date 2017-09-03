import { Component, OnInit, NgZone } from "@angular/core";
import { Location } from "@angular/common";
import { RouterExtensions } from "nativescript-angular/router";
import { NavigationOptions } from "nativescript-angular/router/ns-location-strategy"; 

import { WidgetBase } from "../widget-base";

import { MomentaryWeather } from "../../../models/momentaryWeather";
import { WeatherService } from "../../../services/weather.service";
import { CouchbaseService } from "../../../services/couchbase.service";

@Component({
    selector: "ns-temperature-widget",
    moduleId: module.id,
    templateUrl: "./temperature-widget.component.html",
    styleUrls: ["../widget-base.css", "./temperature-widget.component.css"]
})
export class TemperatureWidgetComponent extends WidgetBase implements OnInit {

    constructor(
        ngZone: NgZone,
        location: Location,
        routerExtensions: RouterExtensions,
        weatherService: WeatherService, 
        couchbaseService: CouchbaseService) { 
            super(ngZone, location, routerExtensions, weatherService, couchbaseService);

            this.registerDbChangeListenerAction(this.updateTemperature);
        }

    // called by base widget class when the current weather database
    // has a changed document
    private updateTemperature(data: MomentaryWeather): void {
        if (data) {
            this.value = data.Temperature;
        }
        else {
            this.value = 0.0;
        }
    }

    private onTap(e) : void {
    //    let options: NavigationOptions = { 
    //         clearHistory: false            
    //     };    
    //     this.routerExtensions.navigate(["temperature"], options);
    }
}