import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';

import { BannedWordsComponent } from './banned-words.component';

describe('BannedWordsComponent', () => {
  let component: BannedWordsComponent;
  let fixture: ComponentFixture<BannedWordsComponent>;
  
  const longString = 'A really wordy comment that no one wants to actually read but is long than 250 characters. We do not actually care what the content says here, only that the string is very very very long and exceeds the max value allowed of 250 characters so that we can test the max length property on the text area.';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, MaterialModule ],
      declarations: [ BannedWordsComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BannedWordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error when a banned word is used', () => {
    component.form.patchValue({ comments: 'Angular is a banned word' })
    fixture.detectChanges();
    const errors = fixture.nativeElement.querySelector('#errors')
    expect(errors.innerText).toEqual('Your comment contains the following forbidden words: Angular')
  })

  it('should show error text is too long', () => {
    component.form.patchValue({ comments: longString })
    fixture.detectChanges();
    const errors = fixture.nativeElement.querySelector('#errors')
    expect(errors.innerText).toEqual('Comment must be 250 characters or less')
  })

  describe('showError', () => {
    it('should return true when the input is too long', () => {
      component.form.patchValue({ comments: longString })
      fixture.detectChanges();
      expect(component.showError('maxlength')).toBeTrue()
    })

    it('should return true when the text area contains banned words', () => {
      component.form.patchValue({ comments: 'JavaScript is a banned word' })
      fixture.detectChanges();
      expect(component.showError('bannedWords')).toBeTrue()
    })

    it('should return false when input is valid', () => {
      component.form.patchValue({ comments: 'This is a valid input' })
      fixture.detectChanges();
      expect(component.showError('bannedWords')).toBeFalse()
      expect(component.showError('maxlength')).toBeFalse()
    })
  })
});
