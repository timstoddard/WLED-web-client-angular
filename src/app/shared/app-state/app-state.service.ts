import { Injectable } from '@angular/core';
import { Store, createState, withProps, select } from '@ngneat/elf';
import { WledApiResponse } from '../api-types';

// TODO create entity store for segments
// TODO create entity store for palettes
// TODO create entity store for effects

interface AppStateProps {
  state: {
    on: boolean;
    brightness: number;
    transition: number;
    currentPresetId: number;
    currentPlaylistId: number;
    nightLight: {
      on: boolean;
      durationMinutes: number;
      mode: 0 | 1 | 2 | 3;
      targetBrightness: number;
      remainingSeconds: number;
    };
    udp: {
      shouldSend: boolean;
      shouldReceive: boolean;
    };
    liveViewOverride: number;
    mainSegmentId: number;
  };
  info: {
    versionName: string;
    versionId: number;
    ledInfo: {
      totalLeds: number;
      fps: number;
      hasWhiteChannel: boolean;
      showWhiteChannelSlider: boolean;
      amps: number;
      maxAmps: number;
      maxSegments: number;
    };
    str: boolean; // TODO is this needed?
    name: string;
    udpPort: number;
    isLive: boolean;
    lm: string; // TODO is this needed?
    sourceIpAddress: string;
    webSocketCount: number;
    effectCount: number;
    paletteCount: number;
    wifi: {
      ssid: string; // TODO bssid vs ssid?
      signalStrength: number;
      channel: number;
    };
    fileSystem: {
      usedSpaceKb: number;
      totalSpaceKb: number;
      lastPresetsJsonEditTimestamp: number;
    };
    wledDevicesOnNetwork: number;
    platform: string;
    arduinoVersion: string;
    freeHeapBytes: number; // TODO is this bytes or other unit?
    uptimeSeconds: number;
    opt: number; // TODO is this needed?
    brand: string;
    productName: string;
    macAddress: string;
    ipAddress: string;
  };
}

const DEFAULT_APP_STATE: AppStateProps = {
  state: {
    on: true,
    brightness: 128,
    transition: 7,
    currentPresetId: 0,
    currentPlaylistId: 0,
    nightLight: {
      on: false,
      durationMinutes: 0,
      mode: 0,
      targetBrightness: 1,
      remainingSeconds: 0,
    },
    udp: {
      shouldSend: false,
      shouldReceive: false,
    },
    liveViewOverride: 0,
    mainSegmentId: 0,
  },
  info: {
    versionName: '',
    versionId: 0,
    ledInfo: {
      totalLeds: 0,
      fps: 0,
      hasWhiteChannel: false,
      showWhiteChannelSlider: false,
      amps: 0,
      maxAmps: 0,
      maxSegments: 0,
    },
    str: false,
    name: '',
    udpPort: 0,
    isLive: false,
    lm: '',
    sourceIpAddress: '',
    webSocketCount: 0,
    effectCount: 0,
    paletteCount: 0,
    wifi: {
      ssid: '',
      signalStrength: 0,
      channel: 0,
    },
    fileSystem: {
      usedSpaceKb: 0,
      totalSpaceKb: 0,
      lastPresetsJsonEditTimestamp: 0,
    },
    wledDevicesOnNetwork: 0,
    platform: '',
    arduinoVersion: '',
    freeHeapBytes: 0,
    uptimeSeconds: 0,
    opt: 0,
    brand: '',
    productName: '',
    macAddress: '',
    ipAddress: '',
  },
};

const { state, config } = createState(withProps<AppStateProps>(DEFAULT_APP_STATE));
const appStateStore = new Store({ name: 'WLED App State', state, config });

@Injectable({ providedIn: 'root' })
export class AppStateService {
  getAppState() {
    return appStateStore.pipe(select((n) => n));
  }

  getOn() {
    return appStateStore.pipe(select((n) => n.state.on));
  }

  getBrightness() {
    return appStateStore.pipe(select((n) => n.state.brightness));
  }

  updateAll = (response: WledApiResponse) => {
    appStateStore.update(() => ({
      state: {
        on: response.state.on,
        brightness: response.state.bri,
        transition: response.state.transition,
        currentPresetId: response.state.ps,
        currentPlaylistId: response.state.pl,
        nightLight: {
          on: response.state.nl.on,
          durationMinutes: response.state.nl.dur,
          mode: response.state.nl.mode,
          targetBrightness: response.state.nl.tbri,
          remainingSeconds: response.state.nl.rem,
        },
        udp: {
          shouldSend: response.state.udpn.send,
          shouldReceive: response.state.udpn.recv,
        },
        liveViewOverride: response.state.lor,
        mainSegmentId: response.state.mainseg,
      },
      info: {
        versionName: response.info.ver,
        versionId: response.info.vid,
        ledInfo: {
          totalLeds: response.info.leds.count,
          fps: response.info.leds.fps,
          hasWhiteChannel: response.info.leds.rgbw,
          showWhiteChannelSlider: response.info.leds.wv,
          amps: response.info.leds.pwr,
          maxAmps: response.info.leds.maxpwr,
          maxSegments: response.info.leds.maxseg,
        },
        str: response.info.str,
        name: response.info.name,
        udpPort: response.info.udpport,
        isLive: response.info.live,
        lm: response.info.lm,
        sourceIpAddress: response.info.lip,
        webSocketCount: response.info.ws,
        effectCount: response.info.fxcount,
        paletteCount: response.info.palcount,
        wifi: {
          ssid: response.info.wifi.bssid,
          signalStrength: response.info.wifi.signal,
          channel: response.info.wifi.channel,
        },
        fileSystem: {
          usedSpaceKb: response.info.fs.u,
          totalSpaceKb: response.info.fs.t,
          lastPresetsJsonEditTimestamp: response.info.fs.pmt,
        },
        wledDevicesOnNetwork: response.info.ndc,
        platform: response.info.arch,
        arduinoVersion: response.info.core,
        freeHeapBytes: response.info.freeheap,
        uptimeSeconds: response.info.uptime,
        opt: response.info.opt,
        brand: response.info.brand,
        productName: response.info.product,
        macAddress: response.info.mac,
        ipAddress: response.info.ip,
      },
    }));
  }

  updateOn = (on: AppStateProps['state']['on']) => {
    appStateStore.update((n) => ({
      state: { ...n.state, on },
      info: n.info,
    }));
  }

  updateBrightness = (brightness: AppStateProps['state']['brightness']) => {
    appStateStore.update((n) => ({
      state: { ...n.state, brightness },
      info: n.info,
    }));
  }

  updateTransition = (transition: AppStateProps['state']['transition']) => {
    appStateStore.update((n) => ({
      state: { ...n.state, transition },
      info: n.info,
    }));
  }
}
