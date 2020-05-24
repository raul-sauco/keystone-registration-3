import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeacherGuard } from './guards/teacher.guard';
import { NoAuthGuard } from './guards/no-auth.guard';


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
    path: 'faq',
    loadChildren: () => import('./pages/faq/faq.module')
      .then(m => m.FaqModule)
  },
  {
    path: 'faq/:trip-id',
    loadChildren: () => import('./pages/faq/faq.module')
      .then(m => m.FaqModule)
  },
  {
    path: 'documents',
    loadChildren: () => import('./pages/documents/documents.module')
    .then(m => m.DocumentsModule)
  },
  {
    path: 'feedback',
    loadChildren: () => import('./pages/feedback/feedback.module')
      .then(m => m.FeedbackModule),
    canActivate: [TeacherGuard]
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./pages/privacy-policy/privacy-policy.module')
      .then(m => m.PrivacyPolicyModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module')
    .then(m => m.LoginModule),
    canActivate: [NoAuthGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module')
    .then(m => m.RegisterModule),
    canActivate: [NoAuthGuard]
  },
  {
    path: 'trip-codes',
    loadChildren: () => import('./pages/trip-codes/trip-codes.module')
    .then(m => m.TripCodesModule),
    canActivate: [NoAuthGuard]
  },
  {
    path: 'trip-codes/:id',
    loadChildren: () => import('./pages/trip-codes/trip-codes.module')
    .then(m => m.TripCodesModule),
    canActivate: [NoAuthGuard]
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
