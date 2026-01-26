import { Component, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { NgxZonelessScrollbar } from 'ngx-zoneless-scrollbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxZonelessScrollbar],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class App {
  name = 'ngx-zoneless-scrollbar Demo';
}

bootstrapApplication(App, {
  providers: [provideExperimentalZonelessChangeDetection()],
});
