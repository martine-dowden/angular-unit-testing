import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatButtonHarness } from '@angular/material/button/testing';


import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../material/material.module';
import { FormService } from '../../services/form/form.service';


import { FormComponent } from './form.component';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let loader: HarnessLoader;

  const mockFormService = new FormService();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      imports: [
        ReactiveFormsModule,
        MaterialModule,
        BrowserAnimationsModule,
      ],
      declarations: [ FormComponent ],
      providers: [
        MatSnackBar,
        { provide: FormService, useValue: mockFormService },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //  Checking multiple values against one function
  const emailValidationTests = [
    { value: 'user@email.com', valid: true },
    { value: 'user@email', valid: false },
    { value: 0, valid: false },
    { value: -1, valid: false },
    { value: 1, valid: false },
    { value: null, valid: true },
    { value: undefined, valid: true },
    { value: 'first.last@company.email.com', valid: true },
    { value: 'user@email.dev', valid: true },
    { value: '@email.com', valid: false },
    { value: 'user.com', valid: false },
    { value: 'user123@email.com', valid: true },
  ];
  emailValidationTests.forEach(test => {
    it(`should validate the email address: "${test.value}"`, () => {
      const emailControl = component.form.get('email');
      emailControl?.patchValue(test.value);
      fixture.detectChanges();
      expect(emailControl?.valid).toBe(test.valid);
    });
  });

  //  Without using Material Harness
  it(`should make the name required`, () => {
    const email = fixture.nativeElement.querySelector('input');
    const required = email.getAttribute('required')
    //  Because required does not have a value
    expect(required).toEqual('');

    //  Check the Angular validators
    const control = component.form.get('name')
    expect(control?.hasValidator(Validators.required)).toBeTruthy()
  });

  //  Using Material Harness
  it(`should display an error to the user if name is invalid`, async () => {
    const input = await loader.getHarness(MatInputHarness.with({ placeholder: 'Email' }))
    await input.focus();
    const invalidEmailValue = 'not a valid email address';
    await input.setValue(invalidEmailValue)
    await input.blur();
    expect(component.form.get('email')?.invalid).toBeTrue();
    const formField = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Email' }))
    const errors = await formField.getTextErrors()
    const emailError = errors.find(e => 'Please provide a valid email address')
    expect(emailError).toBeTruthy();
  })

  it(`should display a hint below the comments with the character count`, async () => {
    const commentsFormField = await loader.getHarness(MatFormFieldHarness.with({ floatingLabelText: 'Comments' }))
    const commentsTextArea = await loader.getHarness(MatInputHarness.with({ placeholder: 'Comments' }))
    await commentsTextArea.setValue('This string is 33 characters long')
    const hintValues = await commentsFormField.getTextHints()
    expect(hintValues[0]).toEqual('33 / 250');
  })

  it(`should disable the submit button when form is invalid and enabled once valid`, async () => {
    //  Disabled
    component.form.reset();
    component.form.setValue({ name: 'My Name', email: 'invalid email address', preference: 1, comments: '' });
    fixture.detectChanges();
    expect(component.form.valid).toBeFalse();
    const testHarnessSubmitButton = await loader.getHarness(MatButtonHarness.with({ text: 'Submit' }))
    let disabled = await testHarnessSubmitButton.isDisabled()
    expect(disabled).toBeTrue()

    //  Enabled, Without Material Harness
    component.form.get('email')?.patchValue('user@email.com');
    fixture.detectChanges();
    expect(component.form.valid).toBeTrue();
    const vanillaSubmitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    disabled = vanillaSubmitButton.disabled
    expect(disabled).toBeFalse();
  });

  it(`should disable the submit button when form is being submitted`, async () => {
    const formVal = { name: 'My Name', email: 'user@email.com', preference: 1, comments: '' };
    component.form.patchValue(formVal);

    //  Disabled
    component.submitting = true;
    fixture.detectChanges();
    let testHarnessSubmitButton = await loader.getHarness(MatButtonHarness.with({ text: 'Submit' }))
    let disabled = await testHarnessSubmitButton.isDisabled()
    expect(disabled).toBeTrue()

    //  Enabled
    component.submitting = false;
    fixture.detectChanges();
    testHarnessSubmitButton = await loader.getHarness(MatButtonHarness.with({ text: 'Submit' }))
    disabled = await testHarnessSubmitButton.isDisabled()
    expect(disabled).toBeFalse();
  });

  it(`should trigger the form service on submit button click`, async () => {
    const serviceSpy = spyOn(mockFormService, 'submit');
    const snackBarSpy = spyOn(component.snackbar, 'open')
    const formVal = { name: 'My Name', email: 'user@email.com', preference: 1, comments: '' };
    component.form.setValue(formVal);
    const submitButton = await loader.getHarness(MatButtonHarness.with({ text: 'Submit' }));
    await submitButton.click();
    await fixture.whenStable();
    expect(serviceSpy).toHaveBeenCalled();
    expect(snackBarSpy).toHaveBeenCalled();
   expect(snackBarSpy.calls.first().args).toEqual([ 'Success: your responses have been submitted', 'ok' ])
  })

  it(`mat snackbar with error message should trigger if service fails`, async () => {
    const serviceSpy = spyOn(mockFormService, 'submit').and.rejectWith(new Promise(reject => reject(new Error('Epic Fail'))));
    const snackBarSpy = spyOn(component.snackbar, 'open');
    const formVal = { name: 'My Name', email: 'user@email.com', preference: 1, comments: '' };
    component.form.setValue(formVal);
    const submitButton = await loader.getHarness(MatButtonHarness.with({ text: 'Submit' }));
    await submitButton.click();
    await fixture.whenStable();
    expect(serviceSpy).toHaveBeenCalled();
    expect(snackBarSpy).toHaveBeenCalled();
    expect(snackBarSpy.calls.first().args).toEqual([ 'Sorry: an error has occurred, please try again later', 'ok' ]);
  })

  it(`should reset form when reset button is clicked`, async () => {
    const resetButton = fixture.nativeElement.querySelector('button[type="button"]');
    const formResetSpy = spyOn(component.form, 'reset')
    resetButton.click();
    fixture.detectChanges();
    expect(formResetSpy).toHaveBeenCalled();
  })

});
