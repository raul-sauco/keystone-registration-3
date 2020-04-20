import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module')
      .then(m => m.HomeModule)
  },
  {
    path: 'home/:trip-id',
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
    path: 'packing-list',
    loadChildren: () => import('./pages/packing-list/packing-list.module')
      .then(m => m.PackingListModule)
  },
  {
    path: 'packing-list/:trip-id',
    loadChildren: () => import('./pages/packing-list/packing-list.module')
      .then(m => m.PackingListModule)
  },
  {
    path: 'guides',
    loadChildren: () => import('./pages/guides/guides.module')
      .then(m => m.GuidesModule)
  },
  {
    path: 'guides/:trip-id',
    loadChildren: () => import('./pages/guides/guides.module')
      .then(m => m.GuidesModule)
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
