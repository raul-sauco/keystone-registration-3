import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module')
      .then(m => m.HomeModule)
  },
  {
    path: 'itinerary',
    loadChildren: () => import('./pages/itinerary/itinerary.module')
      .then(m => m.ItineraryModule)
  },
  {
    path: 'itinerary/:trip-id',
    loadChildren: () => import('./pages/itinerary/itinerary.module')
      .then(m => m.ItineraryModule)
  },
  {
    path: '',
    redirectTo: 'home',   // TODO redirect based on login state
    pathMatch: 'full',
    // canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
