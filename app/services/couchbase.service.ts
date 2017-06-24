import { Injectable } from "@angular/core";
import { Couchbase } from "nativescript-couchbase";

@Injectable()
export class CouchbaseService {

    private database: any;

    constructor() { }

    init() {
        this.database = new Couchbase("farmiot-database");
 
        this.database.createView("weather", "1", (document, emitter) => {
            emitter.emit(document._id, document);
        });
    }

    getDatabase() {
        return this.database;
    }
}