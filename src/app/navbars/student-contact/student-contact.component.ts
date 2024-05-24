import { Component } from '@angular/core';
import { FooterComponent } from "../../the-designs/layouts/footer/footer.component";
import { StudentNavbarComponent } from "../student-navbar/student-navbar.component";

@Component({
    selector: 'app-student-contact',
    standalone: true,
    templateUrl: './student-contact.component.html',
    styleUrl: './student-contact.component.css',
    imports: [FooterComponent, StudentNavbarComponent]
})
export class StudentContactComponent {

}
