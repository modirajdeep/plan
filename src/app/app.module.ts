import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbActionsModule, NbAutocompleteModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbContextMenuModule, NbIconModule, NbInputModule, NbLayoutModule, NbListModule, NbMenuModule, NbPopoverModule, NbSearchModule,
  NbSelectModule, NbSidebarModule,
  NbStepperModule, NbThemeModule, NbThemeService, NbToastrModule, NbToggleModule, NbTooltipModule, NbTreeGridModule, NbWindowModule
} from '@nebular/theme';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { PlanFormComponent } from './plan-form/plan-form.component';
import { PlanListComponent } from './plan-list/plan-list.component';
import { PreviewComponent } from './preview/preview.component';
import { SafeHtmlPipe } from './safe-html.pipe';
import { NbAuthModule } from '@nebular/auth';
import { NbFirebasePasswordStrategy } from '@nebular/firebase-auth';


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
    AppRoutingModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
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
    NbTooltipModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    providePerformance(() => getPerformance()),
    provideRemoteConfig(() => getRemoteConfig()),
    provideStorage(() => getStorage()),
    // NbAuthModule.forRoot({
    //   strategies: [
    //     NbFirebasePasswordStrategy.setup({
    //       name: 'password',
    //     }),
    //   ],
    //   forms: {},
    // }),
  ],
  declarations: [
    AppComponent,
    PlanListComponent,
    PlanFormComponent,
    PreviewComponent,
    ContextMenuComponent,
    SafeHtmlPipe,
  ],
  bootstrap: [AppComponent],
  providers: [NbThemeService, ScreenTrackingService, UserTrackingService]
})
export class AppModule { }
