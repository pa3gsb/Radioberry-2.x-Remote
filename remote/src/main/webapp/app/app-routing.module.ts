import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppComponent} from './app.component';
import {RadioberryComponent} from './radioberry/radioberry.component';


const routes: Routes = [
  { path: '',   redirectTo: 'online', pathMatch: 'full' },
  { path: 'online',   component: RadioberryComponent},
  { path: '**', redirectTo: 'online'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,  { useHash: true, enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
