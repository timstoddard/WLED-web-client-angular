import { Injectable } from '@angular/core';

export interface ClientOnlySegmentFields {
  // name: string;
  isExpanded: boolean;
}

export interface ClientOnlySegmentFieldsMap {
  [segmentId: number]: ClientOnlySegmentFields
}

export const createDefaultSegmentFields = (): ClientOnlySegmentFields => {
  return {
    isExpanded: false,
  };
}

// TODO move to external file
class ClientOnlyFieldsManager<FieldsType> {
  private clientOnlyFieldsMap: { [id: number]: FieldsType };

  constructor() {
    this.clientOnlyFieldsMap = {};
  }

  getFieldsMap(): { [id: number]: FieldsType } {
    return this.clientOnlyFieldsMap;
  }

  updateId(id: number, value: FieldsType) {
    this.updateIds({ [id]: value });
  }

  updateIds(clientOnlyFieldsMap: { [id: number]: FieldsType }) {
    for (const id in clientOnlyFieldsMap) {
      this.clientOnlyFieldsMap[id] = clientOnlyFieldsMap[id];
    }
  }
}

enum ClientOnlyFieldsType {
  SEGMENTS = 'SEGMENTS'
}

// TODO add ability to load client only fields via json file

@Injectable({ providedIn: 'root' })
export class ClientOnlyFieldsService {
  private clientOnlyFieldsManagers: { [key: string]: ClientOnlyFieldsManager<any> };

  constructor() {
    this.clientOnlyFieldsManagers = {
      [ClientOnlyFieldsType.SEGMENTS]:
        new ClientOnlyFieldsManager<ClientOnlySegmentFields>(),
    };
  }

  getSegmentFieldsMap() {
    return this.clientOnlyFieldsManagers[ClientOnlyFieldsType.SEGMENTS]
      .getFieldsMap();
  }

  updateSegmentId(segmentId: number, value: ClientOnlySegmentFields) {
    this.clientOnlyFieldsManagers[ClientOnlyFieldsType.SEGMENTS]
      .updateId(segmentId, value);
  }

  updateSegmentIds(clientOnlySegmentFieldsMap: ClientOnlySegmentFieldsMap) {
    this.clientOnlyFieldsManagers[ClientOnlyFieldsType.SEGMENTS]
      .updateIds(clientOnlySegmentFieldsMap);
  }
}
