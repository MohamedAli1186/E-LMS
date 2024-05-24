import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore } from '@angular/fire/firestore';
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { HeaderComponent } from '../../the-designs/layouts/header/header.component';
import { FooterComponent } from '../../the-designs/layouts/footer/footer.component';
import { StudentNavbarComponent } from '../../navbars/student-navbar/student-navbar.component';

interface chapterDetails {
  id?: string;
  name?: string;
  description?: string;
  pdfLink?: string;
  checked?: any;
}
interface assignmentDetails {
  id?: string;
  title?: string;
  description?: string;
  dueDate?: string;
  assignmentLink?: string;
  answerassignmentLink?: string;
}
interface reqEnrollment {
  courseId?: string;
  studentId?: string;
  response: boolean;
  studentName?: string;
  courseName?: string;
}

@Component({
  selector: 'app-studentcourse',
  standalone: true,
  templateUrl: './courseinfo.component.html',
  styleUrl: './courseinfo.component.css',
  imports: [
    MdbAccordionModule,
    CommonModule,
    HeaderComponent,
    FooterComponent,
    StudentNavbarComponent,
  ],
})
export class StudentcourseComponent {
  button1Clicked = true;
  button2Clicked = false;
  id = localStorage.getItem('sCID');
  name = localStorage.getItem('sCname');
  course: chapterDetails[] = [];
  coursesTotrack: boolean[] = [];
  assignment: assignmentDetails[] = [];
  checked: boolean = false;
  counter: number = 0;
  studentId = localStorage.getItem('userId');
  studentName: string = '';
  firestore: Firestore = inject(Firestore);
  answerassignmentLink: string = '';
  isStudentEnrolled: boolean = false;
  result: any = 0;

  toggleButtonState(buttonNumber: number) {
    if (buttonNumber === 1) {
      this.button1Clicked = true;
      this.button2Clicked = false;
    } else if (buttonNumber === 2) {
      this.button2Clicked = true;
      this.button1Clicked = false;
    }
  }
  ngOnInit(): void {
    this.checkStudentenrolled(this.studentId as string);
    this.getstudentname();
  }

  async getstudentname() {
    try {
      const documentRef = doc(
        collection(this.firestore, 'users'),
        this.studentId as string
      );
      const documentSnapshot = getDoc(documentRef);

      if ((await documentSnapshot).exists()) {
        // Document found, return its data
        this.studentName = (await documentSnapshot).get('username');
      } else {
        // Document doesn't exist
        console.log('Document not found');
      }
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  }
  
  async checkStudentenrolled(studentId: any) {
    const collectionRef = collection(this.firestore, 'courses');
    const queryy = query(collectionRef, where('courseId', '==', this.id));

    const querySnapshot = await getDocs(queryy);

    const documents = querySnapshot.docs.map((doc) => doc.data());

    for (let i in documents[0]['enroledstudents']) {
      if (documents[0]['enroledstudents'][i]['studentId'] == studentId) {
        this.isStudentEnrolled = true;

        break;
      }
    }
    console.log(this.isStudentEnrolled);
  }
  
  async addseecourse(id: any, event: any) {
    this.checked = event.target.checked;
    const collectionRef = collection(this.firestore, 'courses');
    const queryy = query(collectionRef, where('courseId', '==', this.id));

    const querySnapshot = await getDocs(queryy);

    const documents = querySnapshot.docs.map((doc) => doc.data());
    const newDoc: chapterDetails[] = [];
    for (let i in documents[0]['materials']) {
      if (documents[0]['materials'][i]['id'] != id) {
        newDoc.push(documents[0]['materials'][i]);
      } else {
        newDoc.push({
          id: id as string,
          name: documents[0]['materials'][i]['name'],
          description: documents[0]['materials'][i]['description'],
          pdfLink: documents[0]['materials'][i]['pdfLink'],
          checked: this.checked,
        });
      }
    }
    querySnapshot.forEach(async (doc) => {
      await updateDoc(doc.ref, { materials: newDoc });
    });
  }
 
  async reqCourse() {
    const collectionRef = collection(this.firestore, 'courses');
    const queryy = query(collectionRef, where('courseId', '==', this.id));
    const querySnapshot = await getDocs(queryy);
    const documents = querySnapshot.docs.map((doc) => doc.ref);

    const newValues: reqEnrollment = {
      courseId: this.id as string,
      studentId: this.studentId as string,
      response: false,
      studentName: this.studentName,
      courseName: this.name as string,
    };

    // Update each document in the query result
    documents.forEach(async (docRef) => {
      try {
        await updateDoc(docRef, {
          courseRequests: arrayUnion(newValues),
        });
      } catch (error) {
        console.error('Error updating document: ', error);
      }
    });
  }

  
}
