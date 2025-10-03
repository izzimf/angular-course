import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'About Our Team';
  mission = 'We build delightful software for our users.';

  
  photoUrl = 'https://upload.wikimedia.org/wikipedia/ru/thumb/c/cd/Football_Federation_of_Kazakhstan_Logo.svg/1920px-Football_Federation_of_Kazakhstan_Logo.svg.png';
  isButtonDisabled = false;

  
  likes = 0;
  showMessage = false;

 
  name = '';
  email = '';
  subscribed = false;

 
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
