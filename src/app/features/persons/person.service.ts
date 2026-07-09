import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Page, Person } from './person.models';

@Injectable({ providedIn: 'root' })
export class PersonService {
  private readonly baseUrl = `${environment.apiBaseUrl}/persons`;

  constructor(private readonly http: HttpClient) {}

  getPersons(page: number, size: number): Observable<Page<Person>> {
    return this.http.get<Page<Person>>(this.baseUrl, {
      params: { page, size },
    });
  }

  createPerson(person: Person): Observable<Person> {
    return this.http.post<Person>(this.baseUrl, person);
  }
}
