import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckoutFormService {

  private countriesUrl: string = environment.apiURL + "/countries";
  private statesUrl: string = environment.apiURL + "/states";

  constructor(private httpCLient: HttpClient) { }

  getCountries(): Observable<Country[]> {

    return this.httpCLient.get<countryListDTO>(this.countriesUrl)
      .pipe(map(resp => resp._embedded.countries));
  }

  getStates(countrCode: string): Observable<State[]> {

    const stateByCountryCodeUrl = `${this.statesUrl}/search/findByCountryCode?code=${countrCode}`;
    return this.httpCLient.get<statesListDTO>(stateByCountryCodeUrl)
      .pipe(map(resp => resp._embedded.states));
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {

    let data: number[] = [];

    for (let month = startMonth; month <= 12; ++month)
      data.push(month);

    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {

    let data: number[] = [];

    const startYear = new Date().getFullYear();
    const endYear = startYear + 10;

    for (let year = startYear; year <= endYear; year++)
      data.push(year);

    return of(data);
  }
}

interface countryListDTO {
  _embedded: {
    countries: Country[]
  }
}


interface statesListDTO {
  _embedded: {
    states: State[]
  }
}
