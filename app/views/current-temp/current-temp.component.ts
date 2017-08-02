import { Component, OnInit, NgZone } from "@angular/core";
import { Location } from "@angular/common";
import { RouterExtensions } from "nativescript-angular/router";

import { MomentaryWeather } from "../../models/momentaryWeather";
import { WeatherService } from "../../services/weather.service";
import { CouchbaseService } from "../../services/couchbase.service";

@Component({
    selector: "ns-current-temp",
    moduleId: module.id,
    templateUrl: "./current-temp.component.html",
    styleUrls: ["./current-temp.component.css"]
})
export class CurrentTemperatureComponent implements OnInit {

    public temperature: number;
    private currentWeatherDatabase: any;

    constructor(
        private ngZone: NgZone,
        private location: Location,
        private routerExtensions: RouterExtensions,
        private weatherService: WeatherService, 
        private couchbaseService: CouchbaseService) { 
            this.currentWeatherDatabase = couchbaseService.getCurrentWeatherDatabase();

            this.currentWeatherDatabase.addDatabaseChangeListener((changes) => {
                let changeIndex;
                for (var i = 0; i < changes.length; i++) {
                    let documentId = changes[i].getDocumentId();
                    let document = this.currentWeatherDatabase.getDocument(documentId);
                    this.ngZone.run(() => {
                        this.temperature = document.Temperature;
                    });
                }
            });
        }

    ngOnInit(): void {

        let rows = this.currentWeatherDatabase.executeQuery("weather");
        if (rows.length > 0) {
            this.temperature = (<MomentaryWeather>rows[0]).Temperature;
        }
        else {
            this.temperature = 0.0;
        }
    }

    private indexOfObjectId(needle: string, haystack: any) {
        for (var i = 0; i < haystack.length; i++) {
            if (haystack[i] != undefined && haystack[i].hasOwnProperty("_id")) {
                if (haystack[i]._id == needle) {
                    return i;
                }
            }
        }
        return -1;
    }

}