import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";

import { Weather } from "../models/weather";

@Injectable()
export class WeatherService {


    // private data = new Array<Weather>(
    //     { DeviceId: "farm-iot", PublishDate: new Date("6/20/2017 6:23:54 AM"), Humidity: 45.02, Temperature: 76.00, Pressure: 29.32, DeviceVoltage: 3.76, DeviceStateOfCharge: 77.45 }
    // );

    constructor(private http: Http) { }

    getWeather() {
       // return this.data;

        let url = "https://farm-iot-function.azurewebsites.net/api/Weather?code=B0elr3aObzt4y7e48CJb9fQ4lgzmzQxjOa85cl1kc5F1R/8QehxcnA=="
        let headers = new Headers();

        return this.http.get(url, {
            headers: headers
        })
        .map(res => res.json())
        .map(data => {
            let weatherData = [];
            data.Result.forEach((weather) => {
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
        console.log(JSON.stringify(error.json()));
        return Observable.throw(error);
    }

}
