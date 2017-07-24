import { Component, OnInit, NgZone } from "@angular/core";
import { Location } from "@angular/common";
import { RouterExtensions } from "nativescript-angular/router";

import { Weather } from "../../models/weather";
import { WeatherService } from "../../services/weather.service";
import { CouchbaseService } from "../../services/couchbase.service";

@Component({
    selector: "ns-home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {

    weather: Array<Weather> = [];
    weather2: Array<Object> = [];
    database: any;

    constructor(
        private ngZone: NgZone,
        private location: Location,
        private routerExtensions: RouterExtensions,
        private weatherService: WeatherService, 
        private couchbaseService: CouchbaseService) { 
            
            this.database = couchbaseService.getWeatherDatabase();

            this.database.addDatabaseChangeListener((changes) => {
                let changeIndex;
                for (var i = 0; i < changes.length; i++) {
                    let documentId = changes[i].getDocumentId();
                    changeIndex = this.indexOfObjectId(documentId, this.weather2);
                    let document = this.database.getDocument(documentId);
                    this.ngZone.run(() => {
                        if (changeIndex == -1) {
                            this.weather2.push(document);
                        } else {
                            this.weather2[changeIndex] = document;
                        }
                    });
                }
            });

            location.subscribe((path) => {
                this.refresh();
            });
        }

    ngOnInit(): void {
        this.refresh();

        // this.weatherService.getWeather()
        //     .subscribe((loadedWeather) => {
        //         loadedWeather.forEach((weatherObject) => {
        //             this.weather.push(weatherObject);
        //         });
        //     });
    }

    onWindTap(): void {
        console.log("navigating to wind");
        this.routerExtensions.navigate(["wind"]);
    }

    onTestTap(): void {
        console.log("tapping");
        var documentId = this.database.createDocument(
            {
                "DeviceId":"testing",
                "PublishDate": "6/1/2017 5:23 PM",
                "Humidity": 56.7,
                "Temperature": 77.8,
                "Pressure": 28.32,
                "DeviceVoltage": 3.77,
                "DeviceStateOfCharge": 50
            }
        );
        var obj = this.database.getDocument(documentId);
        console.log(obj);
    }

    private refresh() {
        this.weather2 = [];
        let rows = 
            this.database
                .executeQuery("weather")
                .sort(function(a,b) {
                    return new Date(b.PublishDate).getTime() - new Date(a.PublishDate).getTime();
                });
        for(let i = 0; i < rows.length; i++) {
            this.weather2.push(rows[i]);
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
