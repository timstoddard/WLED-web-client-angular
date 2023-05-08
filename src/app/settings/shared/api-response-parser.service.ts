import { Injectable } from '@angular/core';

export interface ParseConfiguration {
  pattern: RegExp;
  name: string;
  isMetadata: boolean;
}

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
        if (match && match[1]) {
          const rawValue = match[1];
          const parsedValue = JSON.parse(rawValue);
          const dict = config.isMetadata ? metadata : formValues;
          dict[config.name] = parsedValue;
          console.log(config.name, '= [', parsedValue, ']')
        }
      } catch (e) {
        console.warn('WARNING: unable to parse saved settings from API response.')
        console.warn(jsFileText)
        console.warn(e)
      }
    }
  
    return {
      formValues,
      metadata,
    };
  }
}
