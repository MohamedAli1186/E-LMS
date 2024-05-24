import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FooterComponent } from "../the-designs/layouts/footer/footer.component";
import { HeaderComponent } from "../the-designs/layouts/header/header.component";

@Component({
    selector: 'app-home-screen',
    standalone: true,
    templateUrl: './home-screen.component.html',
    styleUrl: './home-screen.component.css',
    imports: [FooterComponent, HeaderComponent]
})
export class HomeScreenComponent {
  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
