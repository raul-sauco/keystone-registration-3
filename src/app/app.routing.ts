import { Routes } from '@angular/router';

import { AuthGuard } from '@guards/auth.guard';
import { NoAuthGuard } from '@guards/no-auth.guard';
import { teacherGuard } from '@guards/teacher.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'home/:trip-id',
    loadChildren: () => import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'program-overview',
    loadComponent: () =>
      import('./pages/program-overview/program-overview.component').then(
        (m) => m.ProgramOverviewComponent,
      ),
  },
  {
    path: 'packing-list',
    loadComponent: () =>
      import('./pages/packing-list/packing-list.component').then((m) => m.PackingListComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'guides',
    loadChildren: () => import('./pages/guides/guides.module').then((m) => m.GuidesModule),
  },
  {
    path: 'guides/:trip-id',
    loadChildren: () => import('./pages/guides/guides.module').then((m) => m.GuidesModule),
  },
  {
    path: 'faq',
    loadComponent: () => import('./pages/faq/faq.component').then((m) => m.FaqComponent),
  },
  {
    path: 'documents',
    loadChildren: () => import('./pages/documents/documents.module').then((m) => m.DocumentsModule),
  },
  {
    path: 'documents/:trip-id',
    loadChildren: () => import('./pages/documents/documents.module').then((m) => m.DocumentsModule),
  },
  {
    path: 'accommodation',
    loadComponent: () =>
      import('./pages/accommodation/accommodation.component').then((m) => m.AccommodationComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'feedback',
    loadChildren: () => import('./pages/feedback/feedback.module').then((m) => m.FeedbackModule),
    canActivate: [teacherGuard],
  },
  {
    path: 'participants',
    loadComponent: () =>
      import('./pages/participants/participants.component').then((m) => m.ParticipantsComponent),
    canActivate: [teacherGuard],
  },
  {
    path: 'personal-info',
    loadComponent: () =>
      import('./pages/personal-info/personal-info.component').then((m) => m.PersonalInfoComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'payments',
    loadChildren: () => import('./pages/payments/payments.module').then((m) => m.PaymentsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'payment-policy',
    loadComponent: () =>
      import('./pages/payment-policy/payment-policy.component').then(
        (m) => m.PaymentPolicyComponent,
      ),
  },
  {
    path: 'privacy-policy',
    loadComponent: () =>
      import('./pages/privacy-policy/privacy-policy.component').then(
        (m) => m.PrivacyPolicyComponent,
      ),
  },
  {
    path: 'covid-policy',
    loadComponent: () =>
      import('./pages/covid-policy/covid-policy.component').then((m) => m.CovidPolicyComponent),
  },
  {
    path: 'child-protection',
    loadComponent: () =>
      import('./pages/child-protection/child-protection.component').then(
        (m) => m.ChildProtectionComponent,
      ),
  },
  {
    path: 'teacher-note',
    loadComponent: () =>
      import('./pages/teacher-note/teacher-note.component').then((m) => m.TeacherNoteComponent),
  },
  {
    path: 'help',
    loadChildren: () => import('./pages/help/help.module').then((m) => m.HelpModule),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then((m) => m.RegisterComponent),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'trip-codes',
    loadComponent: () =>
      import('./pages/trip-codes/trip-codes.component').then((m) => m.TripCodesComponent),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'trip-codes/:id',
    loadComponent: () =>
      import('./pages/trip-codes/trip-codes.component').then((m) => m.TripCodesComponent),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'waiver',
    loadComponent: () => import('./pages/waiver/waiver.component').then((m) => m.WaiverComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent,
      ),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'reset-password/:token',
    loadChildren: () =>
      import('./pages/reset-password/reset-password.module').then((m) => m.ResetPasswordModule),
    canActivate: [NoAuthGuard],
  },
  {
    path: '',
    redirectTo: 'home', // TODO redirect based on login state
    pathMatch: 'full',
    // canActivate: [AuthGuard]
  },
];
