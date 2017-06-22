import { Component, OnInit } from "@angular/core";

import { Weather } from "../../models/weather";
import { WeatherService } from "../../services/weather.service";

@Component({
    selector: "ns-home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {

    weather: Array<Weather> = [];

    constructor(private weatherService: WeatherService) { }

    ngOnInit(): void {
        this.weatherService.getWeather()
            .subscribe((loadedWeather) => {
                loadedWeather.forEach((weatherObject) => {
                    this.weather.push(weatherObject);
                });
            });
    }
}
