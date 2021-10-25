import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { FormService } from '../../services/form/form.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppForm } from '../../models/form.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  providers: [ MatSnackBar ]
})
export class FormComponent {

  form: FormGroup;
  submitting = false;

  constructor(
    title: Title,
    meta: Meta,
    private _fb: FormBuilder,
    private _formService: FormService,
    public snackbar: MatSnackBar
  ) {
    title.setTitle('Form | Angular Unit Testing')
    meta.addTag({ property: 'description', content: 'Sample form used to demonstrate unit tests that can be written against a form' })
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    const emailRegex = /^\S{1,}@\S*?\.\S+$/;
    return this._fb.group({
      name: [ '', [ Validators.required, Validators.maxLength(250) ]],
      email: [ '', [ Validators.maxLength(250), Validators.pattern(emailRegex) ]],
      preference: [ 1, [ Validators.required ]],
      comments: [ '', [ Validators.maxLength(250) ]]
    })
  }

  reset(): void {
    this.form.reset();
  }

  async submit(): Promise<void> {
    this.submitting = true;
    try {
      const payload: AppForm = this.form.value;
      await this._formService.submit(payload);
      this.snackbar.open('Success: your responses have been submitted', 'ok' )
    } catch (err) {
      this.snackbar.open('Sorry: an error has occurred, please try again later', 'ok')
    } finally {
      this.submitting = false;
    }
  }

}
