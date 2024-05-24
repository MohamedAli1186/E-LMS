import { Routes } from '@angular/router';
import { CoursesComponent } from './instructor/courses/courses.component';
import { HomeComponent } from './student/home/home.component';
import { SignInComponent } from './student/sign-in/sign-in.component';
import { RegisterComponent } from './student/register/register.component';
import { AdminDashboardComponent } from './admin/admin-page/admin-dashboard.component';
import { CourseCrudComponent } from './admin/edit-course/course-crud.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { ContactComponent } from './the-designs/contact/contact.component';
import { StudentcourseComponent } from './student/courseinfo/courseinfo.component';
import { StudentContactComponent } from './navbars/student-contact/student-contact.component';
import { InstructorContactComponent } from './navbars/instructor-contact/instructor-contact.component';
export const routes: Routes = [
  { path: 'student-contact', component: StudentContactComponent },
  { path: 'instructor-contact', component: InstructorContactComponent },
  { path: 'home-screen', component: HomeScreenComponent },
  { path: 'student-course', component: StudentcourseComponent },
  {
    path: '',
    children: [
      { path: 'register', component: RegisterComponent },
      { path: '', component: HomeScreenComponent },
      { path: 'sign-in', component: SignInComponent },
      { path: 'admin', component: AdminDashboardComponent },
      { path: 'task/:id', component: CourseCrudComponent },
    ],
  },
  { path: 'contact', component: ContactComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'courses', component: CoursesComponent },
  {
    path: 'x',
    loadChildren: () =>
      import('./student/student.module').then((m) => m.StudentModule),
  },

  {
    path: 'instructor',
    loadChildren: () =>
      import('./instructor/instructor.module').then((m) => m.InstructorModule),
  },
];
