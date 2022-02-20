import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppComponent} from './app.component';
import {RadioberryComponent} from './radioberry/radioberry.component';
import {InformationComponent} from "./information/information.component";
import {RxSettingsComponent} from "./settings/rx-settings.component";
import {TxSettingsComponent} from "./settings/tx-settings.component";


const routes: Routes = [
  { path: '',   redirectTo: 'online', pathMatch: 'full' },
  { path: 'online',   component: RadioberryComponent},
  { path: 'info',   component: InformationComponent},
  { path: 'rxset',   component: RxSettingsComponent},
  { path: 'txset',   component: TxSettingsComponent},
  { path: '**', redirectTo: 'online'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,  { useHash: true, enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
