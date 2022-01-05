import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {

  form: FormGroup = this.createForm();

  constructor(private _fb: FormBuilder) { }

  createForm(): FormGroup {
    const emailRegex = /^\S{1,}@\S*?\.\S+$/;
    return this._fb.group({
      email: ['', [Validators.maxLength(50), Validators.pattern(emailRegex), Validators.required]],
    })
  }

  hasError(controlName: string, error: string): boolean {
    const control = this.form.get(controlName);
    return !!control?.dirty && !!control.getError(error);
  }

  reset(): void { this.form.reset(); }
  submit() { console.log('submit'); }
}
