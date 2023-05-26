import { FormControl, ValidationErrors } from "@angular/forms";

export class Validator {

  //white space validation

  static notOnlyWhitespace(control: FormControl): ValidationErrors | null {

    if (control.value != null && (control.value.trim().length === 0)) {
      return { 'notOnlyWhitespace': true }
    }

    return null;
  }


}
