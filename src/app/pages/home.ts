import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Jokes } from '../jokes/jokes-component/jokes';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-home',
  imports: [Jokes, NgOptimizedImage, RouterLink],
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {}
