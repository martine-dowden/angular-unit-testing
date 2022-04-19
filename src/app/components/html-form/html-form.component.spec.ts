import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../material/material.module';
import { FormService } from '../../services/form/form.service';

import { HtmlFormComponent } from './html-form.component';

describe('HtmlFormComponent', () => {
  let component: HtmlFormComponent;
  let fixture: ComponentFixture<HtmlFormComponent>;

  const mockFormService = new FormService();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MaterialModule,
        BrowserAnimationsModule,
      ],
      declarations: [HtmlFormComponent],
      providers: [
        MatSnackBar,
        { provide: FormService, useValue: mockFormService },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should require an the email address`, () => {
    const emailControl = component.form.get('email');
    emailControl?.patchValue(null);
    fixture.detectChanges();
    expect(emailControl?.valid).toBeFalse();
    emailControl?.patchValue('user@email.com');
    fixture.detectChanges();
    expect(emailControl?.valid).toBeTrue();
  });

  //  Checking multiple values against one function
  const emailValidationTests = [
    { value: 'user@email.com', valid: true },
    { value: 'user@email', valid: false },
    { value: 0, valid: false },
    { value: -1, valid: false },
    { value: 1, valid: false },
    { value: null, valid: false },
    { value: undefined, valid: false },
    { value: 'first.last@email.com', valid: true },
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
  })

  it(`should display email field`, () => {
    const emailInput: HTMLInputElement = fixture.debugElement.nativeElement.querySelector('input[formControlName="email"]')
    expect(emailInput).toBeTruthy();

    const control = component.form.get('email');
    control?.patchValue("not a valid email");
    control?.markAllAsTouched();
    fixture.detectChanges();

    const label = <HTMLLabelElement>emailInput.parentNode;
    const errors: NodeListOf<HTMLLabelElement> = label.querySelectorAll('.errors');
    expect(errors.length).toEqual(1);
    expect(errors[0].innerText).toEqual(component.errors.pattern);
  });

  const emailErrors = [
    { value: "", error: 'required' },
    { value: "not a valid email", error: 'pattern' },
    { value: 'very-long-but-structurally-valid@email.com', error: 'maxlength'}
  ];
  emailErrors.forEach(test => {
    it(`should display email field Errors: ${test.error}`, () => {
      const emailInput: HTMLInputElement = fixture.debugElement.nativeElement.querySelector('input[formControlName="email"]')
      expect(emailInput).toBeTruthy();
  
      const control = component.form.get('email');
      control?.patchValue(test.value);
      control?.markAllAsTouched();
      fixture.detectChanges();
  
      const label = <HTMLLabelElement>emailInput.parentNode;
      const errors: NodeListOf<HTMLLabelElement> = label.querySelectorAll('.errors');
      expect(errors.length).toEqual(1);
      expect(errors[0].innerText).toEqual(component.errors[test.error]);
    });
  })



});
