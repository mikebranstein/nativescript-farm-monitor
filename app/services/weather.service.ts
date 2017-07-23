import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";

import { Weather } from "../models/weather";

@Injectable()
export class WeatherService {

    constructor(private http: Http) { }

    getWeather() {
        let url = "https://farm-iot-function.azurewebsites.net/api/v2/weather?code=S7JQc3fpbCthQVSD8lO2jFHWF04dgLCFIlPWi062hEVqy6ruc8UGCQ=="
        let headers = new Headers();

        return this.http.get(url, {
            headers: headers
        })
        .map(res => res.json())
        .map(data => {
            let weatherData = [];
            data.forEach((weather) => {
                weatherData.push(new Weather( 
                    weather.DeviceId, 
                    new Date(weather.PublishDate), 
                    weather.Humidity, 
                    weather.Temperature, 
                    weather.Pressure, 
                    weather.DeviceVoltage, 
                    weather.DeviceStateOfCharge 
                ));
            });
            return weatherData;
        })
        .catch(this.handleErrors);
    }

    handleErrors(error: Response) {
        console.log("Error...");
        console.log(JSON.stringify(error.json()));
        return Observable.throw(error);
    }

}
