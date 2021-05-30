import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  error = false;
  errorMessage!: string;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }
  onLogin(form: NgForm) {
    if (!form.valid) {
      return
    }
    const user = {
      email: form.value.email.toLowerCase(),
      password: form.value.password
    }
    this.authService.loginUser(user)
    this.authService.getLoginErrors().subscribe(
      error => {
        this.error = true
        this.errorMessage = error
        form.resetForm()
      }
    )
  }
}
