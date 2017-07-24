import { Injectable } from "@angular/core";
import { Couchbase } from "nativescript-couchbase";

@Injectable()
export class CouchbaseService {

    private weatherDatabase: any;
    private windDatabase: any;

    constructor() { }

    init() {
        this.weatherDatabase = new Couchbase("weather");
        this.weatherDatabase.createView("weather", "1", (document, emitter) => {
            emitter.emit(document._id, document);
        });

        this.windDatabase = new Couchbase("wind");
        this.windDatabase.destroyDatabase();
        this.windDatabase = new Couchbase("wind");
        this.windDatabase.createView("wind", "1", (document, emitter) => {
            emitter.emit(document._id, document);
        });
    }

    getWeatherDatabase() {
        return this.weatherDatabase;
    }

    getWindDatabase() {
        return this.windDatabase;
    }
}