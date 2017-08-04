import { Component, OnInit, NgZone } from "@angular/core";
import { Location } from "@angular/common";
import { RouterExtensions } from "nativescript-angular/router";
import { topmost } from "ui/frame";

import { MomentaryWeather } from "../../models/momentaryWeather";
import { AggregateWeather } from "../../models/aggregateWeather";
import { WeatherService } from "../../services/weather.service";
import { CouchbaseService } from "../../services/couchbase.service";

import { registerElement } from "nativescript-angular/element-registry";
registerElement("PullToRefresh", () => require("nativescript-pulltorefresh").PullToRefresh);

import { TNSFontIconService } from 'nativescript-ng2-fonticon';

@Component({
    selector: "ns-dashboard",
    moduleId: module.id,
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {

    private currentWeatherDatabase: any;
    private iosStatusBarMaskView: UIView;

    constructor(
        private ngZone: NgZone,
        private location: Location,
        private routerExtensions: RouterExtensions,
        private weatherService: WeatherService, 
        private couchbaseService: CouchbaseService,
        private fonticon: TNSFontIconService) { 
            this.currentWeatherDatabase = this.couchbaseService.getCurrentWeatherDatabase();
        }

    ngOnInit(): void {
        this.initNavBarTransparency();
    }

    refresh(args) {
        var pullRefresh = args.object;

        let rows = this.currentWeatherDatabase.executeQuery("weather");

        this.weatherService.getCurrentWeather()
            .subscribe((data) => {
                data.forEach((x) => {
                    var documentId = rows[0]._id;
                    let doc = {
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
                        };
                    this.currentWeatherDatabase.updateDocument(documentId, doc);
                });
            });

        setTimeout(function () {
            pullRefresh.refreshing = false;
        }, 1000);
    }

    private initNavBarTransparency() {
        if (topmost().ios) {
            let navigationBar = topmost().ios.controller.navigationBar as UINavigationBar;
            navigationBar.translucent = true;
            navigationBar.setBackgroundImageForBarMetrics(UIImage.new(), UIBarMetrics.Default);
            navigationBar.shadowImage = UIImage.new();
            navigationBar.backgroundColor = UIColor.colorWithRedGreenBlueAlpha(0, 0, 0, 0.5);
        }


    }

}