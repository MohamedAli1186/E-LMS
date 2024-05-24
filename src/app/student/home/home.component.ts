import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../the-designs/layouts/header/header.component';
import { FooterComponent } from '../../the-designs/layouts/footer/footer.component';
import { ApiService } from '../../the-helpers/data-service/auth.service';
import { Course } from '../../models/courses';
import { collection, getDoc, getDocs } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { StudentNavbarComponent } from '../../navbars/student-navbar/student-navbar.component';

interface studentCourses {
  id: string;
  name: string;
  description: string;
  hours: string;
  imgsrc: string | undefined;
}
@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [
    CommonModule,
    RouterLink,
    HeaderComponent,
    FooterComponent,
    StudentNavbarComponent,
  ],
})
export class HomeComponent {
  firestore: Firestore = inject(Firestore);

  courses: studentCourses[] = [];

  constructor(private router: Router) {}

  async getCourses() {
    const collectionRef = collection(this.firestore, 'courses');
    const querySnapshot = await getDocs(collectionRef);
    const documents = querySnapshot.docs.map((doc) => doc.data());

    for (let i in documents) {
      const newDoc = {
        id: documents[i]['courseId'],
        name: documents[i]['title'],
        description: documents[i]['description'],
        hours: documents[i]['hours'],
        imgsrc: documents[i]['imgsrc'],
      };

      this.courses.push(newDoc);
    }

    return documents;
  }
  saveInfo(id: string, name: string) {
    localStorage.setItem('sCID', id);
    localStorage.setItem('sCname', name);
    this.router.navigate(['/student-course']);
  }
  ngOnInit(): void {
    this.getCourses();
  }
}
