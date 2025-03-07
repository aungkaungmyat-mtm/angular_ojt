import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeTime',
})
export class RelativeTimePipe implements PipeTransform {
  transform(value: string): string {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSeconds < 60) {
      return 'now';
    } else if (diffMinutes < 60) {
      return this.formatDiff(diffMinutes, 'minute');
    } else if (diffHours < 24) {
      return this.formatDiff(diffHours, 'hour');
    } else if (diffDays < 365) {
      return this.formatDiff(diffDays, 'day');
    } else {
      return this.formatDiff(diffYears, 'year');
    }
  }

  private formatDiff(value: number, unit: string): string {
    return `${value} ${unit}${value > 1 ? 's' : ''} ago`;
  }
}
