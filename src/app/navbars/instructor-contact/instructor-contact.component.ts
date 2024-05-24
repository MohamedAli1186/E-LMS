import { Component } from '@angular/core';
import { InstructorNavbarComponent } from "../instructor-navbar/instructor-navbar.component";
import { FooterComponent } from "../../the-designs/layouts/footer/footer.component";

@Component({
    selector: 'app-instructor-contact',
    standalone: true,
    templateUrl: './instructor-contact.component.html',
    styleUrl: './instructor-contact.component.css',
    imports: [InstructorNavbarComponent, FooterComponent]
})
export class InstructorContactComponent {

}
