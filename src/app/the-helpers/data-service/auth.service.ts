import { Injectable, inject } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import {
  CollectionReference,
  DocumentData,
  DocumentSnapshot,
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable, Subscription, from } from 'rxjs';
import {
  Auth,
  UserCredential,
  authState,
  updateProfile,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user';

const PATH = 'users';
const cPATH = 'courses';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private auth: Auth = inject(Auth);
  authState$ = authState(this.auth);
  private _firestore = inject(Firestore);

  private Url =
    'https://firestore.googleapis.com/v1/projects/e-learning-8c259/databases/(default)/documents';

  constructor(private http: HttpClient) {}

  async register(email: string, password: string, data: any) {
    try {
      const Userdata = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = Userdata.user;
      setDoc(doc(this._firestore, PATH, user.uid), data)
        .then(() => {
          console.log('created');
        })
        .catch((error) => {
          console.error('Error creating user: ', error);
        });
    } catch (error_1) {
      console.error('Error creating user: ', error_1);
    }
  }

  async signIn(email: string, password: string): Promise<string> {
    try {
      const userdata = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userdata.user;
      const userId: string = user.uid;

      localStorage.setItem('userId', userId);
      return userId;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  getUsersByID(id: string): Observable<User> {
    let url: string = `${this.Url}/${PATH}/${id}`;
    return this.http.get<User>(url);
  }

  deleteDocument(documentId: string): Observable<any> {
    let url: string = `${this.Url}/${cPATH}/${documentId}`;
    return this.http.delete(url);
  }

  signOut() {
    this.auth.signOut();
  }
}
