import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Jokes } from './jokes/jokes/jokes';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [Jokes, NgOptimizedImage, RouterOutlet],
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {}
