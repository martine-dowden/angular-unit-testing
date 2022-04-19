import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BannedWordsComponent } from './components/banned-words/banned-words.component';
import { FormComponent } from './components/form/form.component';
import { HtmlFormComponent } from './components/html-form/html-form.component';

const routes: Routes = [
  { path: '', redirectTo: 'form', pathMatch: 'full' },
  { path: 'form', component: FormComponent },
  { path: 'contact-form', component: HtmlFormComponent },
  { path: 'banned-word-list', component: BannedWordsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
