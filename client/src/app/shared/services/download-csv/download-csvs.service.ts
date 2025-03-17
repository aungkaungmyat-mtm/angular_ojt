import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DownloadCsvsService {
  constructor() {}
  public saveDataInCSV(data: Array<any>): string {
    if (data.length == 0) {
      return '';
    }
    let propertyNames = Object.keys(data[0]);
    let rowWithPropertyNames = propertyNames.join(',') + '\n';
    let csvContent = rowWithPropertyNames;
    let rows: string[] = [];
    data.forEach(item => {
      let values: string[] = [];
      propertyNames.forEach(key => {
        let val: any = item[key];
        if (val !== undefined && val !== null) {
          val = String(val);
          // Escape quotes and wrap in quotes if value contains commas or quotes
          if (val.includes(',') || val.includes('"')) {
            val = '"' + val.replace(/"/g, '""') + '"';
          }
        } else {
          val = '';
        }
        values.push(val);
      });
      rows.push(values.join(','));
    });
    csvContent += rows.join('\n');
    return csvContent;
  }
}
