import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { Mentor } from '../persons/person.models';
import { MentorService } from '../persons/mentor.service';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-mentors',
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './mentors.html',
  styleUrl: './mentors.css',
})
export class Mentors implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly mentorService = inject(MentorService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly authService = inject(AuthService);

  readonly mentors = signal<Mentor[]>([]);
  readonly page = signal(0);
  readonly totalPages = signal(0);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);

  readonly form = this.fb.group({
    name: ['', Validators.required],
    age: [null as number | null, Validators.required],
    userName: ['', Validators.required],
  });

  ngOnInit(): void {
    this.loadPage(0);

    if (this.route.snapshot.queryParamMap.get('add') === 'true') {
      this.openAddForm();
    }
  }

  loadPage(page: number): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.mentorService.getMentors(page, PAGE_SIZE).subscribe({
      next: (result) => {
        this.mentors.set(result.content);
        this.page.set(result.number);
        this.totalPages.set(result.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Failed to load mentors.');
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

  openAddForm(): void {
    this.editingId.set(null);
    this.form.reset();
    this.showForm.set(true);
  }

  editMentor(mentor: Mentor): void {
    this.editingId.set(mentor.id);
    this.form.setValue({ name: mentor.name, age: mentor.age, userName: mentor.userName });
    this.showForm.set(true);
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.form.reset();
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const { name, age, userName } = this.form.getRawValue();
    const mentorInput = { name: name!, age: age!, userName: userName! };
    const editingId = this.editingId();

    const request = editingId
      ? this.mentorService.updateMentor(editingId, mentorInput)
      : this.mentorService.createMentor(mentorInput);

    request.subscribe({
      next: () => {
        this.cancelForm();
        this.loadPage(this.page());
      },
      error: () => {
        this.errorMessage.set(editingId ? 'Failed to update mentor.' : 'Failed to add mentor.');
      },
    });
  }

  deleteMentor(mentor: Mentor): void {
    if (!confirm(`Delete ${mentor.name}?`)) {
      return;
    }

    this.mentorService.deleteMentor(mentor.id).subscribe({
      next: () => this.loadPage(this.page()),
      error: () => this.errorMessage.set('Failed to delete mentor.'),
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
