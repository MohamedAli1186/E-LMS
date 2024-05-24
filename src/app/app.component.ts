import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FooterComponent } from './the-designs/layouts/footer/footer.component';
import { HeaderComponent } from './the-designs/layouts/header/header.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection } from 'firebase/firestore';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './the-designs/layouts/page-not-found/page-not-found.component';
import { SignInComponent } from './student/sign-in/sign-in.component';
import { RegisterComponent } from './student/register/register.component';
import { ApiService } from './the-helpers/data-service/auth.service';
import { HttpClient } from '@angular/common/http';
import { CoursesComponent } from './instructor/courses/courses.component';
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    RouterOutlet,
    CommonModule,
    FooterComponent,
    HeaderComponent,
    PageNotFoundComponent,
    SignInComponent,
    RegisterComponent,
    CoursesComponent,
    RouterLink,
    RouterLinkActive,
  ],
})
export class AppComponent {
  http = inject(HttpClient);

  title: string = 'angular-firebase';
}
