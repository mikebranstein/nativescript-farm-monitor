import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";

import { MomentaryWeather } from "../models/momentaryWeather";
import { AggregateWeather } from "../models/aggregateWeather";

@Injectable()
export class WeatherService {

    constructor(private http: Http) { }

    getCurrentWeather() {
        let url = "https://farm-iot-function.azurewebsites.net/api/v3/CurrentWeather?code=QjVrhGFBU1V3nY5gvP6vRVSP2QhEeQnPgAUmrDLesZ8K2WQSNNSWBQ=="
        let headers = new Headers();

        return this.http.get(url, {
            headers: headers
        })
        .map(res => res.json())
        .map(data => {
            let momentaryWeatherData = [];
            data.forEach((x) => {
                momentaryWeatherData.push(new MomentaryWeather( 
                    x.DeviceId, 
                    new Date(x.PublishDate), 
                    x.Humidity, 
                    x.Temperature, 
                    x.Pressure, 
                    x.SoilMoisture,
                    x.SoilTemperature,
                    x.WindSpeedMPH,
                    x.WindDirection,
                    x.RainInInches,
                    x.DeviceVoltage, 
                    x.DeviceStateOfCharge 
                ));
            });
            return momentaryWeatherData;
        })
        .catch(this.handleErrors);
    }

    getWeatherByHour() {
        return this.getWeather("hour");
    }

    private getWeather(byTimeFrame: string) {
        let url = "https://farm-iot-function.azurewebsites.net/api/v3/Weather?code=hGBdt6Frr3aFouwid4ofm3CINSlVoSPsID1AKcaiaTZpWzH5T0mC9w==&by=" + byTimeFrame; 
        let headers = new Headers();

        return this.http.get(url, {
            headers: headers
        })
        .map(res => res.json())
        .map(data => {
            let aggregateWeatherData = [];
            data.forEach((x) => {
                aggregateWeatherData.push(new AggregateWeather( 
                    x.DeviceId, 
                    new Date(x.PublishDate), 
                    x.AverageHumidity, 
                    x.AverageTemperature, 
                    x.AveragePressure, 
                    x.AverageSoilMoisture,
                    x.AverageSoilTemperature,
                    x.AverageWindSpeedMPH,
                    x.AverageWindDirection,
                    x.RainInInches,
                    x.AverageDeviceVoltage, 
                    x.AverageDeviceStateOfCharge,
                    x.MinDeviceStateOfCharge,
                    x.MaxDeviceStateOfCharge
                ));
            });
            return aggregateWeatherData;
        })
        .catch(this.handleErrors);
    }

    private handleErrors(error: Response) {
        console.log("Error...");
        console.log(JSON.stringify(error.json()));
        return Observable.throw(error);
    }

}
