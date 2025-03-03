import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { Post, SortEvent } from '../interfaces/post-interfaces';

export type SortColumn = keyof Post | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = {
  asc: 'desc',
  desc: '',
  '': 'asc',
};

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'sortDirection === "asc"',
    '[class.desc]': 'sortDirection === "desc"',
    '(click)': 'rotate()',
  },
})
export class NgbdSortableHeader {
  @Input() sortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortable, direction: this.direction });
  }
}
