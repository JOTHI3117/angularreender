import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { Mentor, Person } from './person.models';
import { PersonService } from './person.service';
import { MentorService } from './mentor.service';
import { Signals } from '../signals/signals';
import { RxjsSubjects } from '../rxjs-subjects/rxjs-subjects';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-persons',
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive, Signals, RxjsSubjects],
  templateUrl: './persons.html',
  styleUrl: './persons.css',
})
export class Persons implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly personService = inject(PersonService);
  private readonly mentorService = inject(MentorService);
  private readonly router = inject(Router);
  readonly authService = inject(AuthService);

  readonly persons = signal<Person[]>([]);
  readonly page = signal(0);
  readonly totalPages = signal(0);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly showForm = signal(false);
  readonly mentors = signal<Mentor[]>([]);

  readonly form = this.fb.group({
    mentorId: ['', Validators.required],
    name: ['', Validators.required],
    qualification: ['', Validators.required],
  });

  ngOnInit(): void {
    this.loadPage(0);
    this.loadMentors();
  }

  loadMentors(): void {
    this.mentorService.getMentors(0, 100).subscribe({
      next: (result) => this.mentors.set(result.content),
      error: () => this.errorMessage.set('Failed to load mentors.'),
    });
  }

  loadPage(page: number): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.personService.getPersons(page, PAGE_SIZE).subscribe({
      next: (result) => {
        this.persons.set(result.content);
        this.page.set(result.number);
        this.totalPages.set(result.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Failed to load persons.');
      },
    });
  }

  nextPage(): void {
    if (this.page() + 1 < this.totalPages()) {
      this.loadPage(this.page() + 1);
    }
  }

  previousPage(): void {
    if (this.page() > 0) {
      this.loadPage(this.page() - 1);
    }
  }

  toggleForm(): void {
    if (!this.showForm() && this.mentors().length === 0) {
      this.router.navigate(['/mentors'], { queryParams: { add: 'true' } });
      return;
    }

    this.showForm.set(!this.showForm());
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const { mentorId, name, qualification } = this.form.getRawValue();
    this.personService
      .createPerson({ mentor: { id: mentorId! }, name: name!, qualification: qualification! })
      .subscribe({
        next: () => {
          this.form.reset();
          this.showForm.set(false);
          this.loadPage(0);
        },
        error: () => {
          this.errorMessage.set('Failed to create person.');
        },
      });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  deletePerson(person: Person): void {
    if (!person.id || !confirm(`Delete ${person.name}?`)) {
      return;
    }

    this.personService.deletePerson(person.id).subscribe({
      next: () => this.loadPage(this.page()),
      error: () => this.errorMessage.set('Failed to delete person.'),
    });
  }
}
