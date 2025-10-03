import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';   // 👈 ВАЖНО: импортируем FormsModule

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule      // 👈 ВАЖНО: добавляем FormsModule сюда
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
