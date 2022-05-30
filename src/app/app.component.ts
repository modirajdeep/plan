import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, TemplateRef, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as moment from 'moment-timezone';
import { NbToastrService, NbWindowService } from '@nebular/theme';
import { AppService } from './app.service';
import { isURL } from './json/worker';
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('pasteTemplate') pasteTemplate: TemplateRef<any>;
  @ViewChild('urlTemplate') urlTemplate: TemplateRef<any>;
  time = moment().format('DD MMM YYYY h:mm a') + ' : ' + moment.tz.guess();
  input = '';
  output;
  inputStatus = 'basic';

  actions = [
    {
      title: 'home',
      icon: 'home-outline',
      link: '/'
    },
    {
      title: 'log in',
      icon: 'log-in-outline'
    },
    {
      title: 'save',
      icon: 'save-outline',
      disabled: true
    },
    {
      title: 'undo',
      icon: 'undo-outline',
      disabled: true
    },
    {
      title: 'repeat',
      icon: 'repeat-outline'
    },
    {
      title: 'url',
      icon: 'link-2-outline',
      template: 'url',
      badgeDot: true
    },
    {
      title: 'paste',
      icon: 'code-outline',
      // icon: 'clipboard-outline',
      template: 'paste',
      badgeDot: true
    },
    {
      title: 'copy',
      icon: 'code-download-outline',
      // icon: 'copy-outline',
    },
    {
      title: 'share',
      icon: 'share-outline'
    },
    {
      title: 'expand',
      icon: 'expand-outline'
    },
    {
      title: 'collapse',
      icon: 'collapse-outline'
    },
    {
      title: 'history',
      icon: 'hard-drive-outline'
    }
  ]

  constructor(
    private appService: AppService,
    private windowService: NbWindowService,
    private toastrService: NbToastrService,
    @Inject(PLATFORM_ID) private platformId,
  ) { }
  ngOnInit() { if (isPlatformBrowser(this.platformId)) { } }

  parseJSON(input: string) {
    try {
      const result = JSON.parse(input);
      this.inputStatus = 'success';
      return result;
    } catch (error) {
      // this.handleError(error);
      this.inputStatus = 'danger';
      this.output = undefined;
    }
  }

  handleInput(input, isPaste) {
    if (input) {
      if (this.activeWindow == 'paste') {
        let jsonData = this.parseJSON(input);
        if (typeof jsonData == 'string') {
          jsonData = this.parseJSON(jsonData);
        }
        this.input = JSON.stringify(jsonData);
      } else if (this.activeWindow == 'url') {
        this.inputStatus = isURL(input) ? 'success' : 'danger';
        console.log('this.inputStatus -', this.inputStatus)
      }
      if (isPaste && this.inputStatus == 'success') {
        setTimeout(() => this.handleDone(), 700);
      }
    } else {
      this.inputStatus = 'basic';
      this.output = undefined;
    }
  }

  handleAction(action) {
    if (action.template) {
      this.openWindow(this[`${action.template}Template`], action.title);
    } else {
      this.toastrService.show('under construction', action.title, { status: 'primary', icon: 'alert-triangle-outline' });
    }
  }

  activeWindow;
  windowRef;
  windowRefSub;
  openWindow(template, title) {
    this.activeWindow = title;
    if (this.windowRefSub) this.windowRefSub.unsubscribe();
    this.windowRef = this.windowService.open(template, { title });
    this.windowRefSub = this.windowRef.onClose.subscribe(() => {
      this.input = '';
      this.inputStatus = 'basic';
      this.activeWindow = undefined;
    });
    setTimeout(async () => {
      let clipboard = await navigator.clipboard.readText();
      if (clipboard) this.input = clipboard;
      this.handleInput(this.input, 'isPaste');
    }, 700);
  }

  async handleDone() {
    if (this.input) {
      if (this.activeWindow == 'paste') {
        this.appService.newEvent({
          type: 'paste',
          input: this.input
        })
      } else if (this.activeWindow == 'url') {
        console.log(this.input)
        const data = await this.appService.httpRequest(this.input);
        this.appService.newEvent({
          type: 'paste',
          input: JSON.stringify(data)
        })
      }
    }
    this.windowRef.close();
  }

  ngOnDestroy() {
    if (this.windowRefSub) this.windowRefSub.unsubscribe();
  }
}