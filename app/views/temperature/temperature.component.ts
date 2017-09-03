import { Component, OnInit, ViewChild, NgZone } from "@angular/core";
import { Location } from "@angular/common";
import { ObservableArray } from "tns-core-modules/data/observable-array";

import { WeatherService } from "../../services/weather.service";
import { CouchbaseService } from "../../services/couchbase.service";
import { Temperature } from "../../models/temperature";
import { AggregateWeather } from "../../models/aggregateWeather";

@Component({
    selector: "ns-temperature",
    moduleId: module.id,
    templateUrl: "./temperature.component.html"
})
export class TemperatureComponent implements OnInit {

    private data: Array<Temperature> = [];
    private temperature: ObservableArray<Temperature>;
    private aggregateWeatherDatabase: any;
    minRange: Date;
    maxRange: Date;
    @ViewChild("test") chart: any;

    constructor(
        private ngZone: NgZone,
        private location: Location,
        private weatherService: WeatherService, 
        private couchbaseService: CouchbaseService) { 
            this.aggregateWeatherDatabase = this.couchbaseService.getAggregateWeatherDatabase();
        }

    ngOnInit(): void {
        this.maxRange = new Date();
        this.minRange = new Date();
        this.minRange.setHours(this.minRange.getHours() - 12);

        this.refresh();
        this.temperature = new ObservableArray(this.data);
    }

    get dataSource(): ObservableArray<Temperature> {
        return this.temperature;
    }

    private refresh() {
        this.data = [];
        let rows = 
            <Array<AggregateWeather>> this.aggregateWeatherDatabase
                .executeQuery("weather")
                .sort(function(a,b) {
                    return new Date(a.PublishDate).getTime() - new Date(b.PublishDate).getTime();
                });
        for(let i = 0; i < rows.length; i++) {
            this.data.push(new Temperature(
                rows[i].DeviceId, 
                new Date(rows[i].PublishDate), 
                rows[i].AverageTemperature
            ));
        }
    }

}
