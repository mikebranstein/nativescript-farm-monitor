import { Component, OnInit, NgZone } from "@angular/core";
import { Location } from "@angular/common";
import { ObservableArray } from "tns-core-modules/data/observable-array";


import { Weather } from "../../models/weather";
import { Wind } from "../../models/wind";
import { WeatherService } from "../../services/weather.service";
import { CouchbaseService } from "../../services/couchbase.service";

@Component({
    selector: "ns-wind",
    moduleId: module.id,
    templateUrl: "./wind.component.html"
})
export class WindComponent implements OnInit {

    windData: Array<Wind> = [];
    LastUpdatedDate: Date;
    WindSpeed: number;
    private wind: ObservableArray<Wind>;
    private windDatabase: any;
    private weatherDatabase: any;
    minRange: Date;
    maxRange: Date;

    constructor(
        private ngZone: NgZone,
        private location: Location,
        private weatherService: WeatherService, 
        private couchbaseService: CouchbaseService) { 
        
            //this.windDatabase = couchbaseService.getWindDatabase();
            //this.weatherDatabase = couchbaseService.getWeatherDatabase();
        }

    ngOnInit(): void {
        this.maxRange = new Date();
        this.minRange = new Date();
        this.minRange.setHours(this.minRange.getHours() - 12);

        this.refresh();
        this.wind = new ObservableArray(this.windData);

        let weather = 
            this.weatherDatabase
                .executeQuery("weather")
                .sort(function(a,b) {
                    return new Date(b.PublishDate).getTime() - new Date(a.PublishDate).getTime();
                });
        if (weather.length > 0) {
            let w = weather[0];
            this.LastUpdatedDate = new Date(w.PublishDate);
            this.WindSpeed = w.WindSpeedMPH;
        }
    }

    get windSource(): ObservableArray<Wind> {
        return this.wind;
    }

    private refresh() {
        this.windData = [];
        let rows = 
            this.windDatabase
                .executeQuery("wind")
                .sort(function(a,b) {
                    return new Date(b.PublishDate).getTime() - new Date(a.PublishDate).getTime();
                });
        for(let i = 0; i < rows.length; i++) {
            this.windData.push(new Wind(
                rows[i].DeviceId, 
                new Date(rows[i].PublishDate), 
                rows[i].WindSpeedMPH
            ));
        }
    }

}
