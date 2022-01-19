import { TestBed } from '@angular/core/testing';

import { BannedWordsUtility } from './banned-words.utility';

describe('BannedWordsService', () => {
  let service: BannedWordsUtility;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ BannedWordsUtility ]
    });
    service = TestBed.inject(BannedWordsUtility);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('containsBannedWords', () => {
    const tests = [
      { value: 'I love JavaScript', expectedValue: true },
      { value: 'I love Angular', expectedValue: true },
      { value: 'I love Typescript', expectedValue: true },
      { value: 'javascript angular typescript', expectedValue: true },
      { value: 'I drink my java black', expectedValue: false },
      { value: '', expectedValue: false },
    ]
    tests.forEach(test => {
      it (`should detect banned words in the phrase: ${test.value}`, () => {
        expect(service.containsBannedWords(test.value)).toBe(test.expectedValue)
      })
    })
  })

  describe('getUsedForbiddenWords', () => {
    const tests = [
      { value: 'I love JavaScript', expectedValue: 'JavaScript' },
      { value: 'I love Angular', expectedValue: 'Angular' },
      { value: 'I love Typescript', expectedValue: 'Typescript' },
      { value: 'javascript angular typescript', expectedValue: 'javascript, angular, typescript' },
      { value: 'javascript javaScript JavaScript', expectedValue: 'javascript, javaScript, JavaScript' },
      { value: 'I drink my java black', expectedValue: '' },
      { value: '', expectedValue: '' },
    ]
    tests.forEach(test => {
      it (`should return used banned words: ${test.value}`, () => {
        expect(service.getUsedForbiddenWords(test.value)).toBe(test.expectedValue)
      })
    })
  })

  describe('buildRegex', () => {
    const tests = [
      { value: [ 'cats' ], expectedValue: /cats/gim },
      { value: [ 'coffee', 'cookies'], expectedValue: /coffee|cookies/gim },
      { value: [ 'bacon', 'pork', 'pig'], expectedValue: /bacon|pork|pig/gim },
      { value: [ 'css', 'html', 'javascript', 'typescript'], expectedValue: /css|html|javascript|typescript/gim },
    ]
    tests.forEach(test => {
      it (`should return a well formed regular expression: ${test.value}`, () => {
        expect(service.buildRegex(test.value)).toEqual(test.expectedValue)
      })
    })
  })
});
