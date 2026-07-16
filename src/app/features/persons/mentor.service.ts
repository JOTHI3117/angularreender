import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Mentor, Page } from './person.models';

export type MentorInput = Omit<Mentor, 'id'>;

@Injectable({ providedIn: 'root' })
export class MentorService {
  private readonly baseUrl = `${environment.apiBaseUrl}/mentors`;

  constructor(private readonly http: HttpClient) {}

  getMentors(page: number, size: number): Observable<Page<Mentor>> {
    return this.http.get<Page<Mentor>>(this.baseUrl, {
      params: { page, size },
    });
  }

  createMentor(mentor: MentorInput): Observable<Mentor> {
    return this.http.post<Mentor>(this.baseUrl, mentor);
  }

  updateMentor(id: string, mentor: MentorInput): Observable<Mentor> {
    return this.http.put<Mentor>(`${this.baseUrl}/${id}`, mentor);
  }

  deleteMentor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
