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

    private weatherDatabase: any;
    private windDatabase: any;

    constructor(
        private ngZone: NgZone,
        private weatherService: WeatherService, 
        private couchbaseService: CouchbaseService,
        private routerExtensions: RouterExtensions) { 
            
            this.weatherDatabase = couchbaseService.getWeatherDatabase();
            this.windDatabase = couchbaseService.getWindDatabase();
        }

    ngOnInit() : void {

        // load initial weather data
        let count = this.weatherDatabase.executeQuery("weather").length;
        if (count === 0) {
            this.weatherService.getWeather()
                .subscribe((data) => {
                    data.forEach((weatherObject) => {
                        this.weatherDatabase.createDocument(
                            {
                                "DeviceId": weatherObject.DeviceId,
                                "PublishDate": weatherObject.PublishDate.toString(),
                                "Humidity": weatherObject.Humidity,
                                "Temperature": weatherObject.Temperature,
                                "Pressure": weatherObject.Pressure,
                                "WindSpeedMPH": weatherObject.WindSpeedMPH,
                                "DeviceVoltage": weatherObject.DeviceVoltage,
                                "DeviceStateOfCharge": weatherObject.DeviceStateOfCharge
                            }
                        );
                    });
                });
        }

        // load initial wind data
        count = this.windDatabase.executeQuery("wind").length;
        if (count === 0) {
            this.weatherService.getWindSpeedByHour()
                .subscribe((data) => {
                    data.forEach((x) => {
                        this.windDatabase.createDocument(
                            {
                                "DeviceId": x.DeviceId,
                                "PublishDate": x.PublishDate.toString(),
                                "WindSpeedMPH": x.WindSpeedMPH
                            }
                        );
                    });
                });
        }

        this.routerExtensions.navigate(["home"]);
    }
}
