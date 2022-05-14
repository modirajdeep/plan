import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { NbThemeModule, NbAutocompleteModule, NbCardModule, NbSidebarModule, NbLayoutModule, NbButtonModule } from '@nebular/theme'

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';

import { PlanListComponent } from './plan-list/plan-list.component';
import { PlanFormComponent } from './plan-form/plan-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [NbThemeModule.forRoot(),
    BrowserModule, FormsModule,ReactiveFormsModule, NbAutocompleteModule, NbCardModule, NbSidebarModule, NbLayoutModule, NbButtonModule, BrowserAnimationsModule, NbThemeModule.forRoot({ name: 'default' }), NbEvaIconsModule, AppRoutingModule],
  declarations: [
    AppComponent,
    HelloComponent,
    PlanListComponent,
    PlanFormComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
