import { Component, OnInit, NgZone } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";

import { Weather } from "../../models/weather";
import { WeatherService } from "../../services/weather.service";
import { CouchbaseService } from "../../services/couchbase.service";

@Component({
    selector: "ns-init",
    moduleId: module.id,
    templateUrl: "./init.component.html"
})
export class InitComponent implements OnInit {

    private database: any;

    constructor(
        private ngZone: NgZone,
        private weatherService: WeatherService, 
        private couchbaseService: CouchbaseService,
        private routerExtensions: RouterExtensions) { 
            
            this.database = couchbaseService.getDatabase();
        }

    ngOnInit() : void {

        // load initial weather data
        var count = this.database.executeQuery("weather").length;
        if (count === 0) {
            this.weatherService.getWeather()
                .subscribe((data) => {
                    let i = 0;
                    data.forEach((weatherObject) => {
                        i++;
                        console.log("creating " + i);
                        this.database.createDocument(
                            {
                                "DeviceId": weatherObject.DeviceId,
                                "PublishDate": weatherObject.PublishDate.toString(),
                                "Humidity": weatherObject.Humidity,
                                "Temperature": weatherObject.Temperature,
                                "Pressure": weatherObject.Pressure,
                                "DeviceVoltage": weatherObject.DeviceVoltage,
                                "DeviceStateOfCharge": weatherObject.DeviceStateOfCharge
                            }
                        );
                    });

                    console.log("navigating to home...")
                    this.routerExtensions.navigate(["home"]);
                });
        }
        else {
            this.routerExtensions.navigate(["home"]);
        }
    }
}
