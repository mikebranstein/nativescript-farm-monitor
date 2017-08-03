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

    convertRadiansToCardinalDirection(radians: number): string {
        if (radians >= 168.75 && radians < 191.25) return "S";
        if (radians >= 191.25 && radians < 213.75) return "SSW";
        if (radians >= 213.75 && radians < 236.25) return "SW";
        if (radians >= 236.25 && radians < 258.75) return "WSW";
        if (radians >= 258.75 && radians < 281.25) return "W";
        if (radians >= 281.25 && radians < 303.75) return "WNW";
        if (radians >= 303.75 && radians < 326.25) return "NW";
        if (radians >= 326.25 && radians < 348.75) return "NNW";
        if (radians >= 348.75 || radians < 11.25) return "N";
        if (radians >= 11.25 && radians < 33.75) return "NNE";
        if (radians >= 33.75 && radians < 56.25) return "NE";
        if (radians >= 56.25 && radians < 78.75) return "ENE";
        if (radians >= 78.75 && radians < 101.25) return "E";
        if (radians >= 101.25 && radians < 123.75) return "ESE";
        if (radians >= 123.75 && radians < 146.25) return "SE";
        if (radians >= 146.25 && radians < 168.75) return "SSE";
        return "N";
    }

}
