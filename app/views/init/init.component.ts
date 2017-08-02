import { Component, OnInit, NgZone } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { NavigationOptions } from "nativescript-angular/router/ns-location-strategy"; 

import { Weather } from "../../models/weather";
import { WeatherService } from "../../services/weather.service";
import { CouchbaseService } from "../../services/couchbase.service";

@Component({
    selector: "ns-init",
    moduleId: module.id,
    templateUrl: "./init.component.html",
    styleUrls: ["./init.component.css"]
})
export class InitComponent implements OnInit {

    private currentWeatherDatabase: any;
    private aggregateWeatherDatabase: any;

    constructor(
        private ngZone: NgZone,
        private weatherService: WeatherService, 
        private couchbaseService: CouchbaseService,
        private routerExtensions: RouterExtensions) { 

            this.currentWeatherDatabase = couchbaseService.getCurrentWeatherDatabase();
            this.aggregateWeatherDatabase = couchbaseService.getAggregateWeatherDatabase();
        }

    ngOnInit() : void {

        // load current weather data
        let count = this.currentWeatherDatabase.executeQuery("weather").length;
        if (count === 0) {
            this.weatherService.getCurrentWeather()
                .subscribe((data) => {
                    data.forEach((x) => {
                        this.currentWeatherDatabase.createDocument(
                            {
                                "DeviceId": x.DeviceId,
                                "PublishDate": x.PublishDate.toString(),
                                "Humidity": x.Humidity,
                                "Temperature": x.Temperature,
                                "Pressure": x.Pressure,
                                "SoilMoisture": x.SoilMoisture,
                                "SoilTemperature": x.SoilTemperature,
                                "WindSpeedMPH": x.WindSpeedMPH,
                                "WindDirection": x.WindDirection,
                                "RainInInches": x.RainInInches,
                                "DeviceVoltage": x.DeviceVoltage,
                                "DeviceStateOfCharge": x.DeviceStateOfCharge
                            }
                        );
                    });
                });
        }

        // load aggregate weather data, at first by hour
        count = this.aggregateWeatherDatabase.executeQuery("weather").length;
        if (count === 0) {
            this.weatherService.getWeatherByHour()
                .subscribe((data) => {
                    data.forEach((x) => {
                        this.aggregateWeatherDatabase.createDocument(
                            {
                                "DeviceId": x.DeviceId,
                                "PublishDate": x.PublishDate.toString(),
                                "AverageHumidity": x.AverageHumidity,
                                "AverageTemperature": x.AverageTemperature,
                                "AveragePressure": x.AveragePressure,
                                "AverageSoilMoisture": x.AverageSoilMoisture,
                                "AverageSoilTemperature": x.AverageSoilTemperature,
                                "AverageWindSpeedMPH": x.AverageWindSpeedMPH,
                                "AverageWindDirection": x.AverageWindDirection,
                                "RainInInches": x.RainInInches,
                                "AverageDeviceVoltage": x.AverageDeviceVoltage,
                                "AverageDeviceStateOfCharge": x.AverageDeviceStateOfCharge,
                                "MinDeviceStateOfChargee": x.MinDeviceStateOfCharge,
                                "MaxDeviceStateOfCharge": x.MaxDeviceStateOfCharge 
                            }
                        );
                    });
                });
        }

        let options: NavigationOptions = { 
            clearHistory: true               
        };    
        this.routerExtensions.navigate(["dashboard"], options);
    }
}
