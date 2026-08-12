import { Routes } from '@angular/router';

import { AuthGuard } from '@guards/auth.guard';
import { NoAuthGuard } from '@guards/no-auth.guard';
import { teacherGuard } from '@guards/teacher.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'program-overview',
    loadComponent: () =>
      import('./pages/program-overview/program-overview.component').then(
        (m) => m.ProgramOverviewComponent,
      ),
  },
  {
    path: 'guides',
    loadComponent: () => import('./pages/guides/guides.component').then((m) => m.GuidesComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'packing-list',
    loadComponent: () =>
      import('./pages/packing-list/packing-list.component').then((m) => m.PackingListComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'faq',
    loadComponent: () => import('./pages/faq/faq.component').then((m) => m.FaqComponent),
  },
  {
    path: 'documents',
    loadComponent: () =>
      import('./pages/documents/documents.component').then((m) => m.DocumentsComponent),
  },
  {
    path: 'accommodation',
    loadComponent: () =>
      import('./pages/accommodation/accommodation.component').then((m) => m.AccommodationComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'feedback',
    loadComponent: () =>
      import('./pages/feedback/feedback.component').then((m) => m.FeedbackComponent),
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
    loadComponent: () =>
      import('./pages/payments/payments.component').then((m) => m.PaymentsComponent),
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
    loadComponent: () => import('./pages/help/help.component').then((m) => m.HelpComponent),
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
    loadComponent: () =>
      import('./pages/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent,
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
