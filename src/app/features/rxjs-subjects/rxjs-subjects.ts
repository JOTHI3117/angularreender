import { CommonModule } from '@angular/common';
import { Component, OnDestroy, signal } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { NavBar } from '../nav-bar/nav-bar';
import { form, FormField, minLength, required } from '@angular/forms/signals';



interface Profile {
  name: string;
  email: string;
}

@Component({
  selector: 'app-rxjs-subjects',
  imports: [CommonModule, NavBar, FormField],
  templateUrl: './rxjs-subjects.html',
  styleUrl: './rxjs-subjects.css',
})
export class RxjsSubjects implements OnDestroy {
  private readonly subject = new Subject<number>();
  private readonly behaviorSubject = new BehaviorSubject<number>(0);

  private nextValue = 1;
  private lateSubscriberCount = 0;
  private readonly subscriptions: Subscription[] = [];

  readonly subjectLog: string[] = [];
  readonly behaviorSubjectLog: string[] = [];

  readonly sampleText = 'angular pipes example';
  readonly sampleDate = new Date();
  readonly samplePrice = 42.5;
  readonly sampleUser = { name: 'Ada Lovelace', role: 'Engineer' };

  readonly model = signal<Profile>({ name: '', email: '' });
  readonly profileForm = form(this.model, (path) => {
    required(path.name, { message: 'Name is required' });
    minLength(path.email, 5);
  });

  constructor() {
    this.subscriptions.push(
      this.subject.subscribe((value) => this.subjectLog.push(`early subscriber got: ${value}`)),
      this.behaviorSubject.subscribe((value) =>
        this.behaviorSubjectLog.push(`early subscriber got: ${value}`),
      ),
    );
  }

  emit(): void {
    const value = this.nextValue++;
    this.subject.next(value);
    this.behaviorSubject.next(value);
  }

  subscribeLate(): void {
    this.lateSubscriberCount++;
    const label = `late subscriber #${this.lateSubscriberCount}`;

    // Subject: a subscriber that joins now gets nothing until the next emit.
    const subjectSub = this.subject.subscribe((value) =>
      this.subjectLog.push(`${label} got: ${value}`),
    );

    // BehaviorSubject: a subscriber that joins now immediately gets the current value.
    const behaviorSub = this.behaviorSubject.subscribe((value) =>
      this.behaviorSubjectLog.push(`${label} got: ${value} (replayed on subscribe)`),
    );

    this.subscriptions.push(subjectSub, behaviorSub);
  }

  get currentValue(): number {
    return this.behaviorSubject.getValue();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subject.complete();
    this.behaviorSubject.complete();
  }
}
