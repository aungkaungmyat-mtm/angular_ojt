import { inject, Injectable } from '@angular/core';
import { SnackbarService } from '../../../core/services/snackbar/snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class CsvService {
  private readonly snackBar = inject(SnackbarService);

  public saveDataInCsv(data: Array<unknown>): string {
    if (data.length === 0) {
      return '';
    }

    const keySet = new Set<string>();
    data.forEach(item => {
      if (typeof item === 'object' && item !== null) {
        Object.keys(item).forEach(key => keySet.add(key));
      }
    });
    const propertyNames = Array.from(keySet);

    const header = propertyNames.map(key => `"${key.replace(/"/g, '""')}"`).join(',');
    const rows: string[] = [header];

    data.forEach(item => {
      if (typeof item !== 'object' || item === null) {
        rows.push('');
        return;
      }

      const values: string[] = propertyNames.map(key => {
        const val = (item as Record<string, unknown>)[key];
        let formattedVal: string;

        if (val === undefined || val === null) {
          formattedVal = '';
        } else if (typeof val === 'object' || Array.isArray(val)) {
          formattedVal = JSON.stringify(val);
        } else {
          formattedVal = String(val);
        }

        formattedVal = formattedVal.replace(/"/g, '""');
        return `"${formattedVal}"`;
      });

      rows.push(values.join(','));
    });

    return rows.join('\n');
  }

  public downloadCSV(name: string, data: Array<unknown>): void {
    if (data.length === 0) {
      this.snackBar.open('No Data to export');
      return;
    }

    const csvContent = this.saveDataInCsv(data);
    const bom = '\uFEFF';
    const fullContent = bom + csvContent;
    const blob = new Blob([fullContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const hiddenElement = document.createElement('a');
    hiddenElement.href = url;
    hiddenElement.target = '_blank';
    hiddenElement.download = `${name}.csv`;
    hiddenElement.click();
    document.body.removeChild(hiddenElement);

    URL.revokeObjectURL(url);
  }
}
