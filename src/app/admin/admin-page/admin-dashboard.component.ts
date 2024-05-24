import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  arrayUnion,
  collection,
  deleteDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { v4 as uuidv4 } from 'uuid';
import { HeaderComponent } from '../../the-designs/layouts/header/header.component';
export interface Course {
  id: number;
  name: string;
  description: string;
}
interface studentCourses {
  courseId: string;
  name: string;
  description: string;
}
interface courseRequests {
  courseId?: string;
  studentId?: string;
  response?: boolean;
  studentName?: string;
  courseName?: string;
}
interface users {
  email?: string;
  name?: string;
  Approved?: boolean;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    HeaderComponent,
  ],
})
export class AdminDashboardComponent {
  firestore: Firestore = inject(Firestore);

  courses: studentCourses[] = [];
  requests: courseRequests[] = [];
  usrs: users[] = [];
  users = [
    { id: 1, name: 'angelos amgad', email: 'angelos@test.com', status: 'pending' },
    { id: 2, name: 'Mohamed Ali', email: 'mohamedalii@gmail.com',status: 'active',},
  ];
  
  coursess = [
    { name: 'Course 1', description: 'Description for Course 1' },
    { name: 'Course 2', description: 'Description for Course 2' },
    // Add more courses as needed
  ];
  showAddCourseForm = false;
  showEditCourseForm = false;
  showArchiveCoursesTable = false;
  newCourseName = '';
  newCourseDescription = '';
  selectedCourse: any;

  toggleAddCourse() {
    this.showAddCourseForm = !this.showAddCourseForm;
    this.showEditCourseForm = false;
    this.showArchiveCoursesTable = false;
  }

  toggleEditCourses() {
    this.showEditCourseForm = !this.showEditCourseForm;
    this.showAddCourseForm = false;
    this.showArchiveCoursesTable = false;
  }

  toggleArchiveCourses() {
    this.showArchiveCoursesTable = !this.showArchiveCoursesTable;
    this.showAddCourseForm = false;
    this.showEditCourseForm = false;
  }
  
  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.ReturnCourses();
    this.ReturnEnroll();
    this.showusers();
  }
  async ReturnCourses() {
    const Ref = collection(this.firestore, 'courses');
    const query = await getDocs(Ref);
    const documents = query.docs.map((doc) => doc.data());  
    for (let i in documents) {
      const newDoc = {
        courseId: documents[i]['courseId'],
        name: documents[i]['title'],
        description: documents[i]['description'],
      };
      this.courses.push(newDoc);
    } 
    return documents;
  }

  async ReturnEnroll() {
    const Ref = collection(this.firestore, 'courses');
    const query = await getDocs(Ref);
    const documents = query.docs.map((doc) => doc.data());

    for (let doc of documents) {
      for (let i in doc['courseRequests']) {
        const task: courseRequests = {
          courseId: doc['courseRequests'][i]['courseId'],
          studentId: doc['courseRequests'][i]['studentId'],
          response: doc['courseRequests'][i]['response'],
          studentName: doc['courseRequests'][i]['studentName'],
          courseName: doc['courseRequests'][i]['courseName'],
        };
        this.requests.push(task);
      }
    }
  }


  ReturnStatus(id: number) {  //approved?
    const index = this.users.findIndex((user) => user.id === id);
    if (index !== -1) {
      if (this.users[index].status === 'active') {
        this.users[index].status = 'inactive';
      } else {
        this.users[index].status = 'active';
      }
    }
  }

  deleteUser(id: number) {
    this.users = this.users.filter((user) => user.id !== id);
  }
  
  async ApproveRequests(cID: any, sID: any, sname: any) {
    const collectionRef = collection(this.firestore, 'courses');
    const queryy = query(collectionRef, where('courseId', '==', cID));

    const querySnapshot = await getDocs(queryy);
    const newDoc: courseRequests[] = [];

    const documents = querySnapshot.docs.map((doc) => doc.data());
    const document = querySnapshot.docs.map((doc) => doc.ref);
    for (let i in documents[0]['courseRequests']) {
      if (
        documents[0]['courseRequests'][i]['courseId'] != cID &&
        documents[0]['courseRequests'][i]['studentId'] != sID
      ) {
        newDoc.push(documents[0]['courseRequests'][i]);
      }
    }
    querySnapshot.forEach(async (doc) => {
      await updateDoc(doc.ref, { courseRequests: newDoc });
    });

    const newdoc: courseRequests = {
      studentId: sID,
      studentName: sname,
    };

    document.forEach(async (docRef) => {
      try {
        await updateDoc(docRef, {
          enroledstudents: arrayUnion(newdoc),
        });
      } catch (error) {
        console.error('Error updating document: ', error);
      }
    });
  } 
  
  navetotask(id: string, description: string, name: string) { 
  //Navigates to a course details
    this.router.navigate(['/course_crud']);
    localStorage.setItem('cidForAdmin', id);
    localStorage.setItem('cdescForAdmin', description);
    localStorage.setItem('cnameForAdmin', name);

  }
  async cancelRequests(cID: any, sID: any, sname: any) {
    const collectionRef = collection(this.firestore, 'courses');
    const queryy = query(collectionRef, where('courseId', '==', cID));
    const querySnapshot = await getDocs(queryy);
    const newDoc: courseRequests[] = [];
    const documents = querySnapshot.docs.map((doc) => doc.data());
    const document = querySnapshot.docs.map((doc) => doc.ref);
    for (let i in documents[0]['courseRequests']) {
      if (
        documents[0]['courseRequests'][i]['courseId'] != cID &&
        documents[0]['courseRequests'][i]['studentId'] != sID
      ) {
        newDoc.push(documents[0]['courseRequests'][i]);
      }
    }
    querySnapshot.forEach(async (doc) => {
      await updateDoc(doc.ref, { courseRequests: newDoc });
    });
  }
  async showusers() {
    const collectionRef = collection(this.firestore, 'users');
    const querySnapshot = await getDocs(collectionRef);
    const documents = querySnapshot.docs.map((doc) => doc.data());

    for (let i in documents) {
      const newDoc: users = {
        email: documents[i]['email'],
        name: documents[i]['username'],
        Approved: documents[i]['approved'],
      };

      this.usrs.push(newDoc);
    }
  }
  async Approveusers(email: any) {
    if (email !== null) {
      const collectionRef = collection(this.firestore, 'users');
      const queryy = query(collectionRef, where('email', '==', email));
      const querySnapshot = await getDocs(queryy);
      const documents = querySnapshot.docs.map((doc) => doc.data());

      querySnapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, { approved: true });
      });
    }
  }

  async removeusers(email: any) {
    const collectionRef = collection(this.firestore, 'users');
    const querySnapshot = await getDocs(
      query(collectionRef, where('email', '==', email))
    );

    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref).catch((error) => {
        console.error('Error removing document: ', error);
      });
    });
  }
  
  Add(form: NgForm) {
    let task: studentCourses = {
      courseId: uuidv4(),
      name: form.value.name,
      description: form.value.description,
    };
    this.courses.push(task);
    this.adminService.addCourse(task);
    form.reset();
  }

  async Delete(id: any) {
    const collectionRef = collection(this.firestore, 'courses');
    const querySnapshot = await getDocs(
      query(collectionRef, where('courseId', '==', id))
    );

    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });
  } 
  //////////////////////////////////////////////

}
