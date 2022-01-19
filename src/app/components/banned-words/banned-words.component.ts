import { Component } from '@angular/core';
import { FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { BannedWordsUtility } from '../../utilities/banned-words/banned-words.utility';
import { bannedWordValidator } from '../../validators/banned-words.validator';

@Component({
  selector: 'app-banned-words',
  templateUrl: './banned-words.component.html',
  styleUrls: ['./banned-words.component.scss'],
  providers: [ BannedWordsUtility ]
})
export class BannedWordsComponent {

  form = this.fb.group({ comments: ['', [ Validators.maxLength(250), bannedWordValidator() ]]})
  readonly bannedWords = this.utility.bannedWords;

  constructor(
    private fb: FormBuilder,
    private utility: BannedWordsUtility
  ) { }

  showError(error: 'maxlength' | 'bannedWords'): boolean {
    const control = this.form.get('comments')
    return !!control?.hasError(error);
  }

}

