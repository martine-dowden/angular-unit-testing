import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { FormComponent } from './form.component';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule ],
      declarations: [ FormComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const emailTests = [
    { value: 'john@email.com', valid: true },
    { value: 'john@email.', valid: false },
    { value: 'john@email', valid: false },
    { value: 'john@', valid: false },
    { value: 'john', valid: false },
    { value: 'teacher@district.k12.edu', valid: true },
  ]
  emailTests.forEach(test => {
    it(`should validate email pattern: ${test.value}`, () => {
      const control = component.form.get('email');
      
      //  Identify the input element by looking for an input with id of email
      const input = fixture.nativeElement.querySelector('#email');
      //  Identify the error div by looking for a div with id of emailError
      const errors = fixture.nativeElement.querySelector('#emailError');
    
      
      //  dispatch an input event so the input get marked as dirty
      input.dispatchEvent(new Event('input'))

      control?.patchValue(test.value);

      //  update fixture
      fixture.detectChanges();
      //  check that it is in fact dirty
      expect(control?.dirty).toBeTrue();

      //  test that
      //  email pattern error message is not shown when valid
      //  email pattern error message is shown when not valid
      const emailPatternMessage = 'Please provide a valid email address';
      expect(errors.innerText.includes(emailPatternMessage)).toBe(!test.valid)
      
      expect(control?.valid).toBe(test.valid);
      expect(!!control?.getError('pattern')).toBe(!test.valid)
    });
  })

  const emailLengthTests = [
    { value: 'john@email.com', valid: true },
    //  A value of exactly 50 characters (our max length)
    { value: 'userHasAVeryVeryVeryLongUserName@longLongEmail.com', valid: true },
    //  Greater than our max length (54 characters)
    { value: 'userHasAVeryVeryVeryLongUserName@longLongLongEmail.com', valid: false },
  ]
  emailLengthTests.forEach(test => {
    //  change the name of the test
    it(`should validate email length: ${test.value}`, () => {
      const control = component.form.get('email');
      const input = fixture.nativeElement.querySelector('#email');
      const errors = fixture.nativeElement.querySelector('#emailError');
    
      input.dispatchEvent(new Event('input'))
      control?.patchValue(test.value);
      fixture.detectChanges();
      expect(control?.dirty).toBeTrue();

      //  Change the error message
      const emailLengthMessage = 'Email should be less than or equal to 50 characters';
      
      expect(errors.innerText.includes(emailLengthMessage)).toBe(!test.valid)   
      expect(control?.valid).toBe(test.valid);

      //  change the error type we are looking for
      expect(!!control?.getError('maxlength')).toBe(!test.valid)
    });
  })

  const emailRequiredTests = [
    { value: 'john@email.com', valid: true },
    { value: null, valid: false },
  ]
  emailRequiredTests.forEach(test => {
    //  change the name of the test
    it(`should validate email length: ${test.value}`, () => {
      const control = component.form.get('email');
      const input = fixture.nativeElement.querySelector('#email');
      const errors = fixture.nativeElement.querySelector('#emailError');
    
      input.dispatchEvent(new Event('input'))
      control?.patchValue(test.value);
      fixture.detectChanges();
      expect(control?.dirty).toBeTrue();

      //  Change the error message
      const emailRequiredMessage = 'This is a required field';
      
      expect(errors.innerText.includes(emailRequiredMessage)).toBe(!test.valid)   
      expect(control?.valid).toBe(test.valid);

      //  change the error type we are looking for
      expect(!!control?.getError('required')).toBe(!test.valid)
    });
  })

  it(`should have an associated label`, () => {
    //  Finds the first input in the component
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    //  get the input's id
    const id = input.getAttribute('id')
    //  find a label with a for attribute that matches the ID
    const label = fixture.nativeElement.querySelector(`label[for="${id}"`);
    //  Check that label Exists
    expect(label).toBeTruthy();
    //  Check that label includes the word "email"
    //  To lowercase to prevent failure due to capitalization
    expect(label.innerText.toLowerCase()).toContain('email')
  });

  it(`should handle error accessibility`, () => {

    //  Finds the first input in the component
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    //  get the error div's Id
    const errorMessageId = input.getAttribute('aria-errormessage')
    //  find a div with a id that matches the attribute
    const errors = fixture.nativeElement.querySelector(`#${errorMessageId}`);
    //  check that element exists
    expect(errors).toBeTruthy()
    //  Check that is has a role="alert"
    const role = errors.getAttribute('role')
    expect(role).toEqual('alert')
  })

  it(`has an autocomplete attribute`, () => {
    //  Find our email field
    const email = fixture.nativeElement.querySelector('#email') as HTMLInputElement;
    //  get the autocomplete attribute value
    const autocomplete = email.getAttribute('autocomplete');
    //  test that autocomplete has a value
    expect(autocomplete).toBeTruthy();
    //  test autocomplete value is equal to email
    expect(autocomplete).toEqual('email');
  })

  it(`should toggle disabling the submit button based on form state`, () => {
    //  Find our button
    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    //  Patch the form with valid values
    component.form.patchValue({ email: 'user@gmail.com' });
    //  update fixture
    fixture.detectChanges()
    //  Check form validity, should be valid
    expect(component.form.valid).toBeTrue();
    //  Check button state, should be disabled
    expect(button.disabled).toBeFalse();

    //  now patch invalid value
    component.form.patchValue({ email: 'invalid value' });
    //  update fixture
    fixture.detectChanges();
    //  Check form validity, should be invalid
    expect(component.form.valid).toBeFalse();
    //  Check button state, should be disabled
    expect(button.disabled).toBeTrue();
  });

  it(`should reset form`, () => {
    //  Find our button
    const button = fixture.nativeElement.querySelector('button[type="button"]');
    //  Patch the form with valid values
    component.form.patchValue({ email: 'user@gmail.com' });
    //  update fixture
    fixture.detectChanges()
    //  Check form validity, should be valid
    expect(component.form.valid).toBeTrue();
    //  Check button state, should be enabled
    expect(button.disabled).toBeFalse();

    //  now patch invalid value
    component.form.patchValue({ email: 'invalid value' });
    //  update fixture
    fixture.detectChanges();
    //  Check form validity, should be invalid
    expect(component.form.valid).toBeFalse();
    //  Check button state, should be enabled
    expect(button.disabled).toBeFalse();

    // click the button
    button.click();
    //  update fixture
    fixture.detectChanges();
    //  Check that form is back to a pristine state
    expect(component.form.pristine).toBeTrue()
    //  get form value (should no longer have an email value)
    expect(component.form.get('email')?.value).toBe(null)
  });

});
