import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HangmanComponent } from './hangman/hangman.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HangmanComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'hangman';
}
