import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hangman',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hangman.component.html',
  styleUrl: './hangman.component.css',
})
export class HangmanComponent implements OnInit {
  gameId: string = '';
  wordDisplay: string = '';
  attemptsLeft: number = 0;
  guessedLetters: string[] = [];
  gameOver: boolean = false;
  word: string = '';
  alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  wordDisplayWithoutSpaces: string = '';
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.startGame();
  }

  startGame(): void {
    this.http
      .get<any>('http://localhost:8080/api/hangman/start')
      .subscribe((response) => {
        this.gameId = response.gameId;
        this.word = response.word;
        this.wordDisplay = response.wordDisplay;
        this.guessedLetters = [];
        this.attemptsLeft = response.attemptsLeft;
        this.gameOver = false;
      });
  }
  makeGuess(letter: string): void {
    if (this.gameOver || this.guessedLetters.includes(letter)) {
      return;
    }

    this.guessedLetters.push(letter);

    this.http
      .post<any>(
        `http://localhost:8080/api/hangman/guess?gameId=${this.gameId}&letter=${letter}`,
        {}
      )
      .subscribe((response) => {
        this.wordDisplay = response.wordDisplay;
        console.log(this.wordDisplay);
        this.attemptsLeft = response.attemptsLeft;
        this.gameOver = response.gameOver;
        console.log(this.word);
        console.log(this.wordDisplay);
        this.wordDisplayWithoutSpaces = this.wordDisplay.replace(/ /g, '');
        if (
          this.wordDisplayWithoutSpaces === this.word &&
          this.attemptsLeft > 0
        ) {
          this.gameOver = true;
          console.log('You won!');
        } else if (this.attemptsLeft === 0) {
          // Check for loss
          this.gameOver = true;
          console.log('Game Over!');
        }
      });
  }
}
