import { Component, OnInit } from '@angular/core';

// TODO use type from dmx api service once it exists
interface DMX_API_RESPONSE {
  dmxChannels: number;
  dmxStart: number;
  dmxGap: number;
  stripLength: number;
  dmxFixtureMap: number[];
}

const DMX_LABELS = [
  'SET 0',
  'RED',
  'GREEN',
  'BLUE',
  'WHITE',
  'SHUTTER',
  'SET 255',
  'DISABLED',
];

@Component({
  selector: 'app-dmx-map',
  templateUrl: './dmx-map.component.html',
  styleUrls: ['./dmx-map.component.scss']
})
export class DmxMapComponent implements OnInit {
  dmxChannels: number[] = [];

  constructor() {
  }

  ngOnInit(): void {
    this.dmxChannels = this.getDmxChannels();
  }

  getDmxChannels() {
    const dmxApiResponse: DMX_API_RESPONSE = {
      dmxChannels: 0,
      dmxStart: 0,
      dmxGap: 0,
      stripLength: 0,
      dmxFixtureMap: [1, 2, 3, 4, 5, 6, 7, 4, 5, 3, 6, 2, 5, 7, 1, 0],
    };
    const channelCount = dmxApiResponse.dmxChannels;
    const dmxStart = dmxApiResponse.dmxStart;
    const dmxGap = dmxApiResponse.dmxGap;
    const stripLength = dmxApiResponse.stripLength;
    const fixtureMap = dmxApiResponse.dmxFixtureMap;

    // set all to DISABLED
    const dmxChannels: number[] = new Array(512)
      // .fill(7, 0, 512);

    // TODO just for while developing
    for (let i = 0; i < 512; i++) {
      dmxChannels[i] = Math.floor(Math.random() * 7 + 1);
    }

    // for (let i = 0; i < stripLength; i++) {
    //   const dmxIndex = dmxStart + (dmxGap * i);
    //   for (let j = 0; j < channelCount; j++) {
    //     const channelIndex = dmxIndex + j;
    //     dmxChannels[channelIndex - 1] = fixtureMap[j];
    //   }
    // }

    // console.log(dmxChannels)
    return dmxChannels;
  }

  getDmxLabel(channel: number) {
    return DMX_LABELS[channel];
  }
}
