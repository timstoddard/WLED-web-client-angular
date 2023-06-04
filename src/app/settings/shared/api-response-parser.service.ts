import { Injectable } from '@angular/core';
import { ParseConfiguration } from './settings-parse-configurations';

export interface SettingsParsedValues {
  formValues: { [key: string]: unknown };
  metadata: { [key: string]: unknown };
}

@Injectable({ providedIn: 'root' })
export class ApiResponseParserService {
  parseJsFile = (
    jsFileText: string,
    parseConfigurations: ParseConfiguration[],
  ) => {
    const formValues: { [key: string]: unknown } = {};
    const metadata: { [key: string]: unknown } = {};
    console.log(jsFileText)
  
    for (const config of parseConfigurations) {
      try {
        const match = jsFileText.match(config.pattern);
        if (match) {
          if (config.isMetadata) {
            // all metadata matches should have 1 group
            // and name attribute is required
            const parsedValue = JSON.parse(match[1]);
            metadata[config.name] = parsedValue;
            console.log(config.name, '= [', parsedValue, ']')  
          } else {
            // all non-metadata matches should have 2 groups
            // first for name, second for value
            const parsedName = match[1];
            const parsedValue = JSON.parse(match[2]);
            formValues[parsedName] = parsedValue;
            console.log(parsedName, '= [', parsedValue, ']')
          }
        }
      } catch (e) {
        console.error('ERROR: unable to parse saved settings from API response.');
        console.error(e);
        console.warn('JS file content:');
        console.warn(jsFileText);
      }
    }
  
    return {
      formValues,
      metadata,
    };
  }
}
