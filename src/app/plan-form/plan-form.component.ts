import { ChangeDetectionStrategy, Component, ViewChild, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  name: string;
  value: any;
  type: string;
}

@Component({
  selector: 'app-plan-form',
  templateUrl: './plan-form.component.html',
  styleUrls: ['./plan-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanFormComponent implements OnInit {
  customColumn = 'type';
  defaultColumns = ['name', 'value'];
  allColumns = [...this.defaultColumns, this.customColumn,];

  data: TreeNode<FSEntry>[] = [
    {
      data: { name: 'name', value: 'HDFC', type: '' },
    },
    {
      data: { name: 'balance', value: 10499.92, type: 'currency' },
    },
    {
      data: { name: 'minimum', value: 10000, type: 'currency' },
    },
  ];
  types = ['Checkbox', 'Text', 'Number'];
  checked = false;

  toggle(checked: boolean) {
    this.checked = checked;
  }
  users: { name: string, title: string }[] = [
    { name: 'Carla Espinosa', title: 'Nurse' },
    { name: 'Bob Kelso', title: 'Doctor of Medicine' },
    { name: 'Janitor', title: 'Janitor' },
    { name: 'Perry Cox', title: 'Doctor of Medicine' },
    { name: 'Ben Sullivan', title: 'Carpenter and photographer' },
  ];
  options: string[];
  filteredOptions$: Observable<string[]>;

  @ViewChild('autoInput') input;

  ngOnInit() {
    this.options = ['Option 1', 'Option 2', 'Option 3'];
    this.filteredOptions$ = of(this.options);
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
  }

  getFilteredOptions(value: string): Observable<string[]> {
    return of(value).pipe(
      map(filterString => this.filter(filterString)),
    );
  }

  onChange() {
    this.filteredOptions$ = this.getFilteredOptions(this.input.nativeElement.value);
  }

  onSelectionChange($event) {
    this.filteredOptions$ = this.getFilteredOptions($event);
  }

}