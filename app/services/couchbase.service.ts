import { Injectable } from "@angular/core";
import { Couchbase } from "nativescript-couchbase";

@Injectable()
export class CouchbaseService {

    private currentWeatherDatabase: any;
    private aggregateWeatherDatabase: any;

    constructor() { }

    init() {
        // current weather db
        this.currentWeatherDatabase = new Couchbase("current");
        this.currentWeatherDatabase.destroyDatabase();
        this.currentWeatherDatabase = new Couchbase("current");
        this.currentWeatherDatabase.createView("weather", "1", (document, emitter) => {
            emitter.emit(document._id, document);
        });

        this.aggregateWeatherDatabase = new Couchbase("aggregate");
        this.aggregateWeatherDatabase.destroyDatabase();
        this.aggregateWeatherDatabase = new Couchbase("aggregate");
        this.aggregateWeatherDatabase.createView("weather", "1", (document, emitter) => {
            emitter.emit(document._id, document);
        });
    }

    getCurrentWeatherDatabase() {
        return this.currentWeatherDatabase;
    }

    getAggregateWeatherDatabase() {
        return this.aggregateWeatherDatabase;
    }
}