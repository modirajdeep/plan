import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import {
  NbThemeModule,
  NbAutocompleteModule,
  NbTreeGridModule,
  NbSearchModule,
  NbSelectModule,
  NbInputModule,
  NbCardModule,
  NbSidebarModule,
  NbStepperModule,
  NbLayoutModule,
  NbButtonModule,
  NbListModule,
  NbCheckboxModule,
  NbActionsModule,
  NbToggleModule,
  NbPopoverModule,
  NbContextMenuModule,
  NbMenuModule,
  NbThemeService,
  NbIconModule,
  NbToastrModule,
  NbWindowModule,
  NbTooltipModule,
} from '@nebular/theme'

import { AppComponent } from './app.component';

import { PlanListComponent } from './plan-list/plan-list.component';
import { PlanFormComponent } from './plan-form/plan-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AppRoutingModule } from './app-routing.module';
import { PreviewComponent } from './preview/preview.component';
import { ContextMenuComponent } from './context-menu/context-menu.component';

const ToastrConfig: any = {
  position: 'bottom-end',
  status: 'info',
  icon: 'done-all',
  preventDuplicates: true,
  duplicatesBehaviour: 'all'
}

const WindowConfig: any = {
  buttons: {
    minimize: false,
    maximize: false,
    fullScreen: false,
  }
}
@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NbTreeGridModule,
    NbSearchModule,
    ReactiveFormsModule,
    NbSelectModule,
    NbAutocompleteModule,
    NbInputModule,
    NbCardModule,
    NbStepperModule,
    NbSidebarModule,
    NbLayoutModule,
    NbButtonModule, BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbEvaIconsModule,
    AppRoutingModule,
    NbListModule,
    NbCheckboxModule,
    NbActionsModule,
    NbToggleModule,
    NbPopoverModule,
    NbContextMenuModule,
    NbIconModule,
    NbMenuModule.forRoot(),
    NbToastrModule.forRoot(ToastrConfig),
    NbWindowModule.forRoot(WindowConfig),
    NbTooltipModule
  ],
  declarations: [
    AppComponent,
    PlanListComponent,
    PlanFormComponent,
    PreviewComponent,
    ContextMenuComponent,
  ],
  bootstrap: [AppComponent],
  providers: [NbThemeService]
})
export class AppModule { }
