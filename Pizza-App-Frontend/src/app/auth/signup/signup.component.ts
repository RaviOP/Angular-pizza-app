import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  form!: FormGroup;
  constructor(private authService: AuthService,private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      'name': new FormControl(null, [Validators.required]),
      'email': new FormControl(null, [Validators.required, Validators.email],[this.duplicateEmailValidator.bind(this)()]),
      'password': new FormControl(null,[Validators.required,Validators.minLength(6)])
    })
  }

  duplicateEmailValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      const email = control.value.toLowerCase()
      return this.authService.duplicateEmailChecker(email).pipe(
        map(isTaken => (isTaken ? { duplicate: true } : null))
      )
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      return
    }
    const user = {
      name: this.form.value.name,
      email: this.form.value.email.toLowerCase(),
      password: this.form.value.password,
    }
    this.authService.createUser(user)
  }
}
