export interface AppForm {
  name: string;
  email: string;
  preference: number;
  comments: string;
}

export enum preferences {
  'JavaScript',
  'Typescript',
  'No Preference'
}
