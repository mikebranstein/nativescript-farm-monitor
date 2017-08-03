import { Component, NgZone, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { RouterExtensions } from "nativescript-angular/router";

import { MomentaryWeather } from "../../models/momentaryWeather";
import { WeatherService } from "../../services/weather.service";
import { CouchbaseService } from "../../services/couchbase.service";

@Component({
    selector: "ns-base-widget",
    moduleId: module.id
})
export class WidgetBase implements OnInit  {
    public value: number;
    protected currentWeatherDatabase: any;
    private dbChangeListenerAction: any;

    constructor(
        protected ngZone: NgZone,
        protected location: Location,
        protected routerExtensions: RouterExtensions,
        protected weatherService: WeatherService, 
        protected couchbaseService: CouchbaseService) { 
            this.currentWeatherDatabase = couchbaseService.getCurrentWeatherDatabase();

            this.currentWeatherDatabase.addDatabaseChangeListener((changes) => {
                for (var i = 0; i < changes.length; i++) {
                    let documentId = changes[i].getDocumentId();
                    let document = this.currentWeatherDatabase.getDocument(documentId);
                    this.ngZone.run(() => {
                        if (this.dbChangeListenerAction) 
                            this.dbChangeListenerAction(document);
                    });
                }
            });
        }

    ngOnInit(): void {
        let data = this.getCurrentWeather();
        if (this.dbChangeListenerAction) this.dbChangeListenerAction(data);        
    }

    protected registerDbChangeListenerAction(callback: any) {
        this.dbChangeListenerAction = callback;
    }

    private getCurrentWeather(): MomentaryWeather {
        let data = this.currentWeatherDatabase.executeQuery("weather");
        if (data.length > 0) return data[0];
        return null;
    }
}