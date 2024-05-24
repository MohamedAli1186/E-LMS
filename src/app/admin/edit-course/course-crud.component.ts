import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-course-crud',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './course-crud.component.html',
  styleUrl: './course-crud.component.css'
})
export class CourseCrudComponent {
  cname=localStorage.getItem("cnameForAdmin")
  cdescription=localStorage.getItem("cdescForAdmin")
  cid=localStorage.getItem("cidForAdmin")
  firestore:Firestore=inject(Firestore);
  constructor (private route: ActivatedRoute, private adminService: AdminService, private router: Router){}

  ngOnInit(): void{
    
  }

  async EditCourse(){
  console.log(this.cid)

    const collectionRef = collection(this.firestore, 'courses');
    const queryy = query(collectionRef, where('courseId', '==', this.cid));
    const querySnapshot = await getDocs(queryy);

    querySnapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, { 'title': this.cname,'description':this.cdescription}) 
         
} )


}}
