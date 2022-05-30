import { Clipboard } from '@angular/cdk/clipboard';
import { Component, HostListener, NgZone, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbMenuItem, NbToastrService } from '@nebular/theme';
import { AppService } from '../app.service';
import { initialize, TestJSON, contextMenuHandler, handleError, handleAction, JsonActions } from './helpers';
import { htmlOutput } from './worker'

import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';

// https://www.concretepage.com/angular/angular-keyvaluediffers

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit, OnDestroy {
  // Component State
  isEdit = false;
  hideNa = true;
  input = '';
  output;

  string(obj) {
    return JSON.stringify(obj);
  }

  // Context menu 
  contextX: number;
  contextY: number;
  isDisplayContextMenu: boolean;
  contextMenuItems: Array<NbMenuItem> = [];
  @HostListener('document:click')
  documentClick(): void {
    this.isDisplayContextMenu = false;
  }
  displayContextMenu(event) {
    contextMenuHandler(event, this);
  }
  getRightClickMenuStyle() {
    return {
      position: 'fixed',
      left: `${this.contextX}px`,
      top: `${this.contextY}px`
    }
  }

  // Subscriptions
  appServiceSub;
  queryParamsSub;
  constructor(
    public zone: NgZone,
    public router: Router,
    public clipboard: Clipboard,
    public cd: ChangeDetectorRef,
    public route: ActivatedRoute,
    public appService: AppService,
    public toastrService: NbToastrService,
    public dataSourceBuilder: NbTreeGridDataSourceBuilder<any> //
  ) { }
  ngOnInit(): void {
    initialize(JSON.stringify(TestJSON), this);
    this.appServiceSub = this.appService.events.subscribe(data => {
      if (data.type == 'paste') {
        initialize(data.input, this);
      }
    })
    this.queryParamsSub = this.route.queryParams.subscribe((params: JsonActions) => handleAction(params, this));
  }
  ngOnDestroy() {
    this.appServiceSub.unsubscribe();
    this.queryParamsSub.unsubscribe();
  }
  htmlOutput(row, index?) {
    return htmlOutput(row, index);
  }

  toggleAccordion(event, row) {
    let expand = false;
    try {
      expand = !event.target.className.includes('meta');
    } catch (error) {
      handleError(this, error, 'Error identifying meta class', row);
    }
    if (expand) {
      row.expanded = !row.expanded
    }
  }

  // datatable
  tableData(value): NbTreeGridDataSource<any> {
    let dataSource: TreeNode<any>[] = value.map(data => ({ data }));
    // console.log({ dataSource })
    const result = this.dataSourceBuilder.create(dataSource);
    // console.log({ result })
    return result;
  }
  sortColumn: string = '';
  sortDirection: NbSortDirection = NbSortDirection.NONE;
  changeSort(sortRequest: NbSortRequest): void {
    // this.dataSource.sort(sortRequest); TODO implement sorting
    this.sortColumn = sortRequest.column;
    this.sortDirection = sortRequest.direction;
  }
  getDirection(column: string): NbSortDirection {
    if (column === this.sortColumn) {
      return this.sortDirection;
    }
    return NbSortDirection.NONE;
  }
}
