import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-plan-form',
  templateUrl: './plan-form.component.html',
  styleUrls: ['./plan-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanFormComponent implements OnInit {

  options: string[];
  filteredControlOptions$: Observable<string[]>;
  filteredNgModelOptions$: Observable<string[]>;
  inputFormControl: FormControl;
  value: string;

  ngOnInit() {

    this.options = ['Option 1', 'Option 2', 'Option 3'];
    this.filteredControlOptions$ = of(this.options);
    this.filteredNgModelOptions$ = of(this.options);

    this.inputFormControl = new FormControl();
    this.filteredControlOptions$ = this.inputFormControl.valueChanges
      .pipe(
        startWith(''),
        map(filterString => this.filter(filterString)),
      );
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
  }

  onModelChange(value: string) {
    this.filteredNgModelOptions$ = of(this.filter(value));
  }

}