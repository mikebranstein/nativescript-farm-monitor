import { Component } from "@angular/core";
import { CouchbaseService } from "./services/couchbase.service";

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html",
})
export class AppComponent { 

    constructor(private couchbaseService: CouchbaseService) {
        couchbaseService.init();
    }
}
