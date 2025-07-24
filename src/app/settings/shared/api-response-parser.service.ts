import { Injectable } from '@angular/core';
import { ParseConfiguration, ParseConfigurationType } from './settings-parse-configurations';
import { BinaryValue, convertToBoolean } from './settings-types';

export interface SettingsParsedValues {
  formValues: { [key: string]: unknown };
  // TODO uncomment, fix type issues
  // formCheckboxes: { [key: string]: unknown };
  // formSelectedIndexes: { [key: string]: unknown };
  metadata: { [key: string]: unknown };
  methodCalls: ParsedMethodCall[];
}

export type ParsedMethodCall = Array<string | unknown[]>;

@Injectable({ providedIn: 'root' })
export class ApiResponseParserService {
  parseJsFile = (
    jsFileText: string,
    parseConfigurations: ParseConfiguration[],
  ) => {
    const formValues: { [key: string]: unknown } = {};
    const formCheckboxes: { [key: string]: unknown } = {};
    const formSelectedIndexes: { [key: string]: unknown } = {};
    const metadata: { [key: string]: unknown } = {};
    const methodCalls: Array<Array<string | unknown[]>> = [];
    console.log(jsFileText);
  
    for (const config of parseConfigurations) {
      try {
        const match = jsFileText.match(config.pattern);
        if (match) {
          let parsedName: string;
          let parsedValue: unknown;
          switch (config.type) {
            case ParseConfigurationType.FORM_VALUE:
              parsedName = match[1];
              parsedValue = JSON.parse(match[2]);
              formValues[parsedName] = parsedValue;
              console.log(parsedName, '= [', parsedValue, '] (value)');
              break;
            case ParseConfigurationType.FORM_CHECKBOX:
              parsedName = match[1];
              parsedValue = JSON.parse(match[2]);
              formCheckboxes[parsedName] = convertToBoolean(parsedValue as BinaryValue);
              console.log(parsedName, '= [', parsedValue, '] (checked)');
              break;
            case ParseConfigurationType.FORM_SELECTED_INDEX:
              parsedName = match[1];
              parsedValue = JSON.parse(match[2]);
              formSelectedIndexes[parsedName] = parsedValue;
              console.log(parsedName, '= [', parsedValue, '] (selectedIndex)');
              break;
            case ParseConfigurationType.METADATA:
              parsedValue = JSON.parse(match[1]);
              metadata[config.name] = parsedValue;
              console.log(config.name, '= [', parsedValue, ']');
              break;
            case ParseConfigurationType.READ_ONLY_VALUE:
              parsedName = match[1];
              parsedValue = JSON.parse(match[2]);
              metadata[parsedName] = parsedValue;
              console.log(parsedName, '= [', parsedValue, ']');
              break;
            case ParseConfigurationType.METHOD_CALL:
              parsedName = match[1];
              const params = `[${match[2].replaceAll('\'', '"')}]`;
              parsedValue = JSON.parse(params);
              methodCalls.push([parsedName, parsedValue as unknown[]]);
              console.log(parsedName, '(', parsedValue, ')');
              break;
            default:
              break;
          }
        }
      } catch (e) {
        console.error('ERROR: unable to parse saved settings from API response.');
        console.error(e);
        console.warn('JS file content:');
        console.warn(jsFileText);
      }
    }

    console.log('formValues', formValues);
    console.log('formCheckboxes', formCheckboxes);
    console.log('formSelectedIndexes', formSelectedIndexes);
    console.log('metadata', metadata);
    console.log('methodCalls', methodCalls);
  
    return {
      formValues,
      formCheckboxes,
      formSelectedIndexes,
      metadata,
      methodCalls,
    };
  }
}
