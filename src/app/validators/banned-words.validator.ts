import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { BannedWordsUtility } from '../utilities/banned-words/banned-words.utility';

export function bannedWordValidator(): ValidatorFn {

  const utility = new BannedWordsUtility();

  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value
    if (!value) { return null; }
    const containsBannedWords = utility.containsBannedWords(value);
    return containsBannedWords ? {
      bannedWords: { value: control.value, bannedWords: utility.getUsedForbiddenWords(control.value) }
    } : null
  }
}
