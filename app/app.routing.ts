import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { InitComponent } from "./views/init/init.component";
import { DashboardComponent } from "./views/dashboard/dashboard.component";
import { TemperatureComponent } from "./views/temperature/temperature.component";

const routes: Routes = [
    { path: "", redirectTo: "/init", pathMatch: "full" },
    { path: "init", component: InitComponent },
    { path: "dashboard", component: DashboardComponent },
    { path: "temperature", component: TemperatureComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }