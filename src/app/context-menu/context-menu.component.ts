import { Component, Input } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent {

  constructor() { }
  @Input()
  contextMenuItems: Array<NbMenuItem>;
}
