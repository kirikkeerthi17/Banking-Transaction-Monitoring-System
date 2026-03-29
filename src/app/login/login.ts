import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  username = '';
  password = '';
  errorMsg = '';

  constructor(private router: Router) {}

  // 🔐 Hash function (Base64)
  encrypt(value: string): string {
    return btoa(value);
  }

  onLogin() {

    const encryptedPassword = this.encrypt(this.password);

    // Stored hashed passwords
    const adminPass = btoa('admin');
    const userPass = btoa('user');

    if (this.username === 'admin' && encryptedPassword === adminPass) {
      localStorage.setItem('role', 'admin');
      this.router.navigate(['/dashboard']);
  } 
    else if (this.username === 'user' && encryptedPassword === userPass) {
      localStorage.setItem('role', 'user');
      this.router.navigate(['/dashboard']);
  }
    else {
      this.errorMsg = 'Invalid Credentials';
    }
  }
}