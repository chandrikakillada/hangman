import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  attemptsLeft: number = 6;
  guessedLetters: string[] = [];
  gameOver: boolean = false;
  alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.startGame();
  }

  startGame(): void {
    this.http
      .get<any>('http://localhost:8080/api/hangman/start')
      .subscribe((response) => {
        this.gameId = response.gameId;
        this.wordDisplay = response.wordDisplay;
        this.attemptsLeft = response.attemptsLeft;
        this.guessedLetters = [];
        this.gameOver = false;
      });
  }
  makeGuess(letter: string): void {
    if (this.guessedLetters.includes(letter) || this.gameOver) {
      return;
    }
    this.guessedLetters.push(letter);

    this.http
      .post<any>(
        `http://localhost:8080/api/hangman/guess?gameId=${this.gameId}&letter=${letter}`,
        {}
      )
      .pipe(
        tap((response) => {
          console.log('API Response:', response);
          this.wordDisplay = response.wordDisplay;
          this.attemptsLeft = response.attemptsLeft;
          this.gameOver = response.isGameOver;
        })
      )
      .subscribe();
  }
}
