import { Component, computed, signal } from '@angular/core';
import { NavBar } from '../nav-bar/nav-bar';

@Component({
  selector: 'app-signals',
  imports: [NavBar],
  templateUrl: './signals.html',
  styleUrl: './signals.css',
})
export class Signals {




 count = signal(0);
  // doubleCount = computed(() => this.count() * 2);

  increment() {
    this.count.update(v => v + 1);
  }

}
