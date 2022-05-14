import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit  {
  name = 'Angular';

   constructor(
    @Inject(PLATFORM_ID) private platformId,
    ) 
    {
    }
    ngOnInit() {
     if (isPlatformBrowser(this.platformId)) {
       console.log('Angular Works!!!')
     }
    }
}
