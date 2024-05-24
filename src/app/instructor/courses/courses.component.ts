import { Component ,inject} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, Routes } from '@angular/router';
import { SignInComponent } from '../../student/sign-in/sign-in.component';
import { Course } from '../../models/courses';
import { Firestore, updateDoc } from '@angular/fire/firestore';
import { CollectionReference, DocumentData, DocumentReference, QueryDocumentSnapshot, addDoc,collection, deleteDoc, doc, getDoc, getDocs ,query, where} from 'firebase/firestore';
import{v4 as uuidv4}from'uuid'
import firebase from 'firebase/compat';
import { Observable, map } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HeaderComponent } from "../../the-designs/layouts/header/header.component";
import { FooterComponent } from "../../the-designs/layouts/footer/footer.component";
import { InstructorNavbarComponent } from "../../navbars/instructor-navbar/instructor-navbar.component";

interface instructorCourses {
  id:string;
  name: string;
  description:string;
  hours:string
  imgsrc:string|undefined
}


@Component({
    selector: 'app-courses',
    standalone: true,
    templateUrl: './courses.component.html',
    styleUrl: './courses.component.css',
    imports: [FormsModule, RouterModule, HeaderComponent, FooterComponent, InstructorNavbarComponent]
})
export class CoursesComponent { 
  id=localStorage.getItem('userId');
  course:Course=Course.getInstance();
  cid:string='';
  title:string='Courses'
  isAvailable:boolean=true
  showAddCourse:boolean=false
  showEditCourse:boolean=false
  firestore:Firestore=inject(Firestore);
  iname:string=''
  acollection=collection(this.firestore,'courses');
  courses=this.getDocumentsByInstructorId();    
  Cours: instructorCourses[] =[]; 
  ////////////////////////////////
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getDocumentById();
    
  }

  handleFileInput(event: any) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (file) {
      this.course.imgsrc = file.name; // Extracts and assigns just the filename
    }
  }

  passID(id:string,name:string){
    localStorage.setItem('courseId',id)
    localStorage.setItem('courseName',name)
      // Variable stored successfully
    
  }
  
  ShowAddCourse(){
    if(this.showAddCourse==false){
      this.showAddCourse=true;
    
    }else{
      this.showAddCourse=false;
    }
   this.showEditCourse=false
   this.course.title='';
   this.course.description='';
   this.course.hours='';
  }

  
  async addCourse(){
    if (this.course.title.trim() !== ''&&this.course.description.trim() !== ''&&this.course.hours.trim() !== '') {
      this.course.id=uuidv4();
      console.log(this.course.imgsrc.split('\\').pop());
      const acollection=collection(this.firestore,'courses');
        addDoc(acollection,{
        'courseId':this.course.id,
        'title':this.course.title,
        'description':this.course.description,
        'hours':this.course.hours,
        'instructorID':this.id,
        'materials':this.course.materials,
        'enroledstudents':this.course.students,
        'assignments':this.course.assignments,
        'imgsrc':this.course.imgsrc.split('\\').pop()
      }).then(()=>{

        const myDiv = document.getElementById("ta");
        if (myDiv) {
          const newTask: instructorCourses = {
            id:this.course.id,
            name:this.course.title,
            description:this.course.description,
            hours:this.course.hours,
            imgsrc:this.course.imgsrc.split('\\').pop()
          };

            this.Cours.push(newTask);
          
            // Change innerHTML to refresh content
            myDiv.classList.toggle("refresh");
        }
      })
      alert('course added');
      this.showAddCourse=false;
        
    } else {
      alert('Please Enter all information');
    }
      
  }
    async getDocumentById()  {
    try {
      const documentRef = doc(collection(this.firestore,'users'),this.id as string)
      const documentSnapshot =  getDoc(documentRef);
      
      if ((await documentSnapshot).exists()) {
        // Document found, return its data
        this.iname = (await documentSnapshot).get('username');
        
           return  (await documentSnapshot).data();
      } else {
        // Document doesn't exist
        console.log("Document not found");
        return "";
      }
    } catch (error) {
      console.error("Error getting document:", error);
      throw error;
    }
  }

  async getDocumentsByInstructorId() {
    if (this.id !== null) {
      const collectionRef = collection(this.firestore, 'courses');
      const queryy = query(collectionRef, where('instructorID', '==', this.id));
      const querySnapshot = await getDocs(queryy);
      const documents = querySnapshot.docs.map((doc) => doc.data());

      for(let i in documents){
        const newTask: instructorCourses = {
          id: documents[i]['courseId'],
          name: documents[i]['title'],
          description:documents[i]['description'],
          hours:documents[i]['hours'],
          imgsrc:documents[i]['imgsrc']
        };
        
        this.Cours.push(newTask)
      }
      return documents;
    } else {
      return null;
    }
  }
  
  ShowEditCourse(id:string,name:string,description:string,date:string,imgsrc:any) {
    if(  this.showEditCourse==false){
      this.showEditCourse=true;
    
    }else{
      this.showEditCourse=false;
    }
    this.showAddCourse=false;
     this.course.title=name;
     this.course.description=description;
     this.course.hours=date;
     this.cid=id;
     this.course.imgsrc=imgsrc
    }

    async editCourse(id:string){
      try {
        const collectionRef = collection(this.firestore, 'courses');
        const queryy = query(collectionRef, where('courseId', '==', id));
        const querySnapshot = await getDocs(queryy);

        querySnapshot.forEach(async (doc) => {
            await updateDoc(doc.ref, { 'title': this.course.title,'description':this.course.description,'hours':this.course.hours,  'imgsrc':this.course.imgsrc.split('\\').pop() }) 
             .then(() => {
              console.log("Document successfully updated");
              this.Cours.forEach((element,index) => {
                if(element.id==id){
                  element.name=this.course.title
                  element.description=this.course.description
                  element.hours=this.course.hours
                  element.imgsrc=this.course.imgsrc
                }
              });
              const myDiv = document.getElementById("ta");
              if (myDiv) {
              myDiv.classList.toggle("refresh");

            }
            this.showEditCourse=false;
          
          })
          
        });
    } catch (error) {
        console.error('Error updating document:', error);
        throw error;
    }
  
  }
    
  async removeCourse(id:string)
    {
    const collectionRef = collection(this.firestore, 'courses');
    const querySnapshot = await getDocs(query(collectionRef, where('courseId', '==', id)));

    querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref)
            .then(() => {
                console.log("Document successfully deleted!");
                this.Cours.forEach((element,index) => {
                  if(element.id==id){
                    this.Cours.splice(index,1)
                  }
                });
                const myDiv = document.getElementById("ta");
                if (myDiv) {
                myDiv.classList.toggle("refresh");
              }
            })
            .catch((error) => {
                console.error("Error removing document: ", error);
            });
    });
    }
  
  }
  
    
    
    


