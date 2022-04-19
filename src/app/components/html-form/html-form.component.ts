import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormService } from '../../services/form/form.service';

@Component({
  selector: 'app-html-form',
  templateUrl: './html-form.component.html',
  styleUrls: ['./html-form.component.scss'],
  providers: [MatSnackBar]
})
export class HtmlFormComponent {

  form: FormGroup = this.createForm()

  public errors: { [key: string]: string } = {
    required: 'This field is required',
    pattern: 'This doesn\'t look quite right',
    maxlength: 'Value is too long'
  }

  constructor(
    public snackbar: MatSnackBar,
    private _fb: FormBuilder,
    private _formService: FormService,
  ) { }

  createForm(): FormGroup {
    const emailRegex: RegExp = /^\S{1,}@\S*?\.\S+$/;
    return this._fb.group({
      name: [null, [Validators.required, Validators.maxLength(25)]],
      email: [null, [Validators.required, Validators.maxLength(25), Validators.pattern(emailRegex)]],
      phone: [null, [Validators.maxLength(12)]],
      message: [null, [Validators.required, Validators.maxLength(250)]]
    })
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.form.invalid) {
      this.snackbar.open('Sorry: Please make sure all fields are valid', 'ok')
      return
    }
    const payload = this.form.value
    try {
      await this._formService.submit(payload)
      this.snackbar.open('Success: your message have been sent', 'ok')
      this.reset()
    } catch (err) {
      this.snackbar.open('Sorry: an error has occurred, please try again later', 'ok')
    }
  }

  reset(): void {
    this.form.reset()
  }

  showErrors(formControlName: string): string[] {
    const control: AbstractControl | null = this.form.get(formControlName)
    if (!control || !control.errors || !control.touched) { return [] }
    return Object.keys(control.errors).map(key => this.errors[key])
  }

}
