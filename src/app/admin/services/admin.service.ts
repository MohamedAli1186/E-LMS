import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private firestoreUrl =
    'https://firestore.googleapis.com/v1/projects/e-learning-8c259/databases/(default)/documents';

  private list: any[] = [];

  constructor(private http: HttpClient) {}

  getList() {
    return this.list;
  }

  getTask(id: number) {
    return this.list[id];
  }

  setList(newList: any[]) {
    this.list = newList;
  }

  editTask(id: number, task: any) {
    this.list[id] = task;
    const courseId = task.courseId;

    const firestoreData = {
      fields: {
        title: { stringValue: task.name },
        description: { stringValue: task.description },
        Edited: {
          arrayValue: {
            values: [
              {
                mapValue: {
                  fields: {
                    name: { stringValue: task.name },
                    description: { stringValue: task.description },
                  },
                },
              },
            ],
          },
        },
      },
    };
    this.http
      .patch(
        `${this.firestoreUrl}/courses/${courseId}?updateMask.fieldPaths=Edited`,
        firestoreData
      )
      .subscribe(
        (response) => {
          console.log('Course updated successfully:', response);
          alert('Course updated');
        },
        (error) => {
          console.error('Error updating course:', error);
          alert('Failed to update course');
        }
      );
  }

  deleteTask(id: number) {
    this.list.splice(id, 1);
  }

  addCourse(course: any) {
    const courseId = uuidv4();
    const firestoreData = {
      fields: {
        courseId: { stringValue: courseId },
        title: { stringValue: course.name },
        description: { stringValue: course.description },
      },
    };

    this.http.post(`${this.firestoreUrl}/courses`, firestoreData).subscribe(
      (response) => {
        console.log('Course added successfully:', response);
        alert('Course added');
      },
      (error) => {
        console.error('Error adding course:', error);
        alert('Failed to add course');
      }
    );
  }
}
