import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // 1. Interpolation
  title = 'About Our Team';
  mission = 'We build delightful software for our users.';

  // 2. Property Binding
  photoUrl = 'https://angular.io/assets/images/logos/angular/angular.png';
  isButtonDisabled = false;

  // 3. Event Binding
  likes = 0;
  showMessage = false;

  // 4. Two-Way Binding
  name = '';
  email = '';
  subscribed = false;

  // Methods
  addLike() {
    this.likes++;
  }

  toggleMessage() {
    this.showMessage = !this.showMessage;
  }

  subscribe() {
    if (this.email) {
      this.subscribed = true;
    }
  }
}
