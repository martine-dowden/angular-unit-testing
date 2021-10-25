import { Injectable } from '@angular/core';
import { AppForm } from '../../models/form.model';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  submit(payload: AppForm):  Promise<AppForm> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(payload)
      }, 500)
    });
  }

}
