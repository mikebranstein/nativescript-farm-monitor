import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { InitComponent } from "./views/init/init.component";
import { HomeComponent } from "./views/home/home.component";

const routes: Routes = [
    { path: "", redirectTo: "/init", pathMatch: "full" },
    { path: "init", component: InitComponent },
    { path: "home", component: HomeComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }