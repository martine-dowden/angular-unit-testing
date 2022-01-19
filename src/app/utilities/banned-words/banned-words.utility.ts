import { Injectable } from '@angular/core';

@Injectable()
export class BannedWordsUtility {

  readonly bannedWordsList = [ 'javascript', 'angular', 'typescript' ];
  readonly regex: RegExp = this.buildRegex(this.bannedWordsList)
  readonly bannedWords = this.bannedWordsList.toString().replace(/,/gmi, ', ');

  containsBannedWords(value: string): boolean {
    if (!value) { return false }
    return this.regex.test(value);
  }

  getUsedForbiddenWords(value: string): string {
    if(!value) { return value; }
    return [...new Set(value.match(this.regex))].toString().replace(/,/gmi, ', ');
  }

  buildRegex(bannedWords: string[]): RegExp {
    //  dynamically build the regex
    let regexPattern = ''
    bannedWords.forEach((word, i) => { 
      //  if not first term add | (or)
      if (i !== 0) { regexPattern += '|'}
      regexPattern += word
    })
    //  build regex from pattern
    const regex = new RegExp(regexPattern, 'gmi')
    return regex;
  }
}
