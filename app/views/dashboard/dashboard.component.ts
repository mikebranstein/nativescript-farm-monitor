import { Component, OnInit, ViewChild, NgZone, ElementRef } from "@angular/core";
import { Location } from "@angular/common";
import { RouterExtensions } from "nativescript-angular/router";
import { topmost } from "ui/frame"; 
import { StackLayout } from "ui/layouts/stack-layout";

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

    @ViewChild("footer") footerStackLayout: ElementRef;

    private currentWeatherDatabase: any;
    private iosStatusBarMaskView: UIView;
    
    batteryLevelIcon: string;
    batteryLevel: number;
    lastUpdated: Date;

    constructor(
        private ngZone: NgZone,
        private location: Location,
        private routerExtensions: RouterExtensions,
        private weatherService: WeatherService, 
        private couchbaseService: CouchbaseService,
        private fonticon: TNSFontIconService) { 
            this.currentWeatherDatabase = this.couchbaseService.getCurrentWeatherDatabase();

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
        this.initNavBarTransparency();
        this.initFooterTransparency();
    }

    refresh(args) {
        let pullRefresh = args.object;

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
            }, () => { // error
                pullRefresh.refreshing = false;
            }, () => { // completed 
                setTimeout(() => {
                    pullRefresh.refreshing = false;
                }, 500);
            });
    }

    private dbChangeListenerAction(data: MomentaryWeather) {
        if (data) {
            // update battery data
            this.batteryLevel = data.DeviceStateOfCharge;
            if (data.DeviceStateOfCharge > 80.0) this.batteryLevelIcon = "fa-battery-4";
            if (data.DeviceStateOfCharge > 60.0 && data.DeviceStateOfCharge <= 80.0) this.batteryLevelIcon = "fa-battery-3";
            if (data.DeviceStateOfCharge > 40.0 && data.DeviceStateOfCharge <= 60.0) this.batteryLevelIcon = "fa-battery-2";
            if (data.DeviceStateOfCharge > 20.0 && data.DeviceStateOfCharge <= 40.0) this.batteryLevelIcon = "fa-battery-1";
            if (data.DeviceStateOfCharge > 60.0 && data.DeviceStateOfCharge <= 20.0) this.batteryLevelIcon = "fa-battery-0";

            // update last updated date
            this.lastUpdated = new Date(data.PublishDate);
        }
        else {
            this.batteryLevel = 0.0;
            this.batteryLevelIcon = "fa-battery-0";
            this.lastUpdated = new Date();
        }
    }

    private initNavBarTransparency() {
        if (topmost().ios) {
            let navigationBar = topmost().ios.controller.navigationBar as UINavigationBar;
            navigationBar.barStyle = UIBarStyle.BlackTranslucent;
        }
    }

    private initFooterTransparency() {
        if (topmost().ios) {
            let footerUIView = (<UIView> (<StackLayout> this.footerStackLayout.nativeElement).nativeView);
            footerUIView.opaque = false;
            footerUIView.backgroundColor = UIColor.colorWithRedGreenBlueAlpha(0, 0, 0, 0.5);
        }
    }

}