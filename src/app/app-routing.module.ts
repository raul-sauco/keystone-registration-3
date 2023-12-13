import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@guards/auth.guard';
import { NoAuthGuard } from '@guards/no-auth.guard';
import { SchoolAdminGuard } from '@guards/school-admin.guard';
import { TeacherGuard } from '@guards/teacher.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'home/:trip-id',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'program-overview',
    loadChildren: () =>
      import('./pages/program-overview/program-overview.module').then(
        (m) => m.ProgramOverviewModule
      ),
  },
  {
    path: 'program-overview/:trip-id',
    loadChildren: () =>
      import('./pages/program-overview/program-overview.module').then(
        (m) => m.ProgramOverviewModule
      ),
  },
  {
    path: 'packing-list',
    loadChildren: () =>
      import('./pages/packing-list/packing-list.module').then(
        (m) => m.PackingListModule
      ),
  },
  {
    path: 'packing-list/:trip-id',
    loadChildren: () =>
      import('./pages/packing-list/packing-list.module').then(
        (m) => m.PackingListModule
      ),
  },
  {
    path: 'guides',
    loadChildren: () =>
      import('./pages/guides/guides.module').then((m) => m.GuidesModule),
  },
  {
    path: 'guides/:trip-id',
    loadChildren: () =>
      import('./pages/guides/guides.module').then((m) => m.GuidesModule),
  },
  {
    path: 'faq',
    loadChildren: () =>
      import('./pages/faq/faq.module').then((m) => m.FaqModule),
  },
  {
    path: 'faq/:trip-id',
    loadChildren: () =>
      import('./pages/faq/faq.module').then((m) => m.FaqModule),
  },
  {
    path: 'documents',
    loadChildren: () =>
      import('./pages/documents/documents.module').then(
        (m) => m.DocumentsModule
      ),
  },
  {
    path: 'documents/:trip-id',
    loadChildren: () =>
      import('./pages/documents/documents.module').then(
        (m) => m.DocumentsModule
      ),
  },
  {
    path: 'accommodation',
    loadChildren: () =>
      import('./pages/accommodation/accommodation.module').then(
        (m) => m.AccommodationModule
      ),
    // canActivate: [AuthGuard],
  },
  {
    path: 'accommodation/:trip-id',
    loadChildren: () =>
      import('./pages/accommodation/accommodation.module').then(
        (m) => m.AccommodationModule
      ),
    // canActivate: [AuthGuard],
  },
  {
    path: 'feedback',
    loadChildren: () =>
      import('./pages/feedback/feedback.module').then((m) => m.FeedbackModule),
    canActivate: [TeacherGuard],
  },
  {
    path: 'participants',
    loadChildren: () =>
      import('./pages/participants/participants.module').then(
        (m) => m.ParticipantsModule
      ),
    canActivate: [TeacherGuard],
  },
  {
    path: 'personal-info',
    loadChildren: () =>
      import('./pages/personal-info/personal-info.module').then(
        (m) => m.PersonalInfoModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'payments',
    loadChildren: () =>
      import('./pages/payments/payments.module').then((m) => m.PaymentsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'payment-policy',
    loadChildren: () =>
      import('./pages/payment-policy/payment-policy.module').then(
        (m) => m.PaymentPolicyModule
      ),
  },
  {
    path: 'privacy-policy',
    loadChildren: () =>
      import('./pages/privacy-policy/privacy-policy.module').then(
        (m) => m.PrivacyPolicyModule
      ),
  },
  {
    path: 'privacy-policy/:trip-id',
    loadChildren: () =>
      import('./pages/privacy-policy/privacy-policy.module').then(
        (m) => m.PrivacyPolicyModule
      ),
  },
  {
    path: 'covid-policy',
    loadComponent: () =>
      import('./pages/covid-policy/covid-policy.component').then(
        (m) => m.CovidPolicyComponent
      ),
  },
  {
    path: 'child-protection',
    loadChildren: () =>
      import('./pages/child-protection/child-protection.module').then(
        (m) => m.ChildProtectionModule
      ),
  },
  {
    path: 'child-protection/:trip-id',
    loadChildren: () =>
      import('./pages/child-protection/child-protection.module').then(
        (m) => m.ChildProtectionModule
      ),
  },
  {
    path: 'teacher-note',
    loadChildren: () =>
      import('./pages/teacher-note/teacher-note.module').then(
        (m) => m.TeacherNoteModule
      ),
  },
  {
    path: 'help',
    loadChildren: () =>
      import('./pages/help/help.module').then((m) => m.HelpModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginModule),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/register/register.module').then((m) => m.RegisterModule),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'trip-codes',
    loadChildren: () =>
      import('./pages/trip-codes/trip-codes.module').then(
        (m) => m.TripCodesModule
      ),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'trip-codes/:id',
    loadChildren: () =>
      import('./pages/trip-codes/trip-codes.module').then(
        (m) => m.TripCodesModule
      ),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'waiver',
    loadChildren: () =>
      import('./pages/waiver/waiver.module').then((m) => m.WaiverModule),
  },
  {
    path: 'trip-switcher',
    loadChildren: () =>
      import('./pages/trip-switcher/trip-switcher.module').then(
        (m) => m.TripSwitcherModule
      ),
    canActivate: [SchoolAdminGuard],
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./pages/forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordModule
      ),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'reset-password/:token',
    loadChildren: () =>
      import('./pages/reset-password/reset-password.module').then(
        (m) => m.ResetPasswordModule
      ),
    canActivate: [NoAuthGuard],
  },
  {
    path: '',
    redirectTo: 'home', // TODO redirect based on login state
    pathMatch: 'full',
    // canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
