import { Injectable } from '@angular/core';
import { Store, createState, withProps, select } from '@ngneat/elf';
import { Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WledApiResponse } from '../api-types';

interface AppStateProps {
  state: AppState;
  info: AppInfo;
  palettes: string[];
  effects: string[];
  localSettings: AppLocalSettings;
}

export interface AppState {
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
}

interface AppInfo {
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
  shouldToggleReceiveWithSend: boolean;
  name: string;
  udpPort: number;
  isLive: boolean; // TODO rename, only for UDP
  lm: string; // TODO is this needed?
  sourceIpAddress: string;
  webSocketCount: number;
  effectCount: number;
  paletteCount: number;
  wifi: {
    bssid: string;
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
}

export interface AppLocalSettings {
  isLiveViewActive: boolean;
  // TODO can this be a string? (pros/cons)
  selectedWledIpAddress: WledIpAddress;
  wledIpAddresses: WledIpAddress[];
}

export interface WledIpAddress {
  name: string,
  ipv4Address: string,
}

export const NO_DEVICE_IP_SELECTED: WledIpAddress = {
  name: 'None',
  ipv4Address: '',
};

// TODO better defaults
const DEFAULT_WLED_IP_ADDRESSES: WledIpAddress[] = [
  {
    name: 'Living Room',
    ipv4Address: '192.168.100.171',
  },
  {
    name: 'Bedroom',
    ipv4Address: '192.168.100.21',
  },
  {
    name: 'Office',
    ipv4Address: '192.168.100.5',
  },
];
const DEFAULT_SELECTED_WLED_IP_ADDRESS = NO_DEVICE_IP_SELECTED;
// const DEFAULT_SELECTED_WLED_IP_ADDRESS: WledIpAddress = environment.production
  // ? NO_DEVICE_IP_SELECTED
  // : DEFAULT_WLED_IP_ADDRESSES[0];

/** State of the app before hydration. Everything is turned off. */
export const DEFAULT_APP_STATE: AppStateProps = {
  state: {
    on: false,
    brightness: 0,
    transition: 0,
    currentPresetId: 0,
    currentPlaylistId: 0,
    nightLight: {
      on: false,
      durationMinutes: 0,
      mode: 0,
      targetBrightness: 0,
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
    shouldToggleReceiveWithSend: false,
    name: '',
    udpPort: 0,
    isLive: false,
    lm: '',
    sourceIpAddress: '',
    webSocketCount: 0,
    effectCount: 0,
    paletteCount: 0,
    wifi: {
      bssid: '',
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
  palettes: [],
  effects: [],
  localSettings: {
    isLiveViewActive: false,
    selectedWledIpAddress: DEFAULT_SELECTED_WLED_IP_ADDRESS,
    wledIpAddresses: DEFAULT_WLED_IP_ADDRESSES,
  }
};

@Injectable({ providedIn: 'root' })
export class AppStateService {
  private appStateStore: Store;

  constructor() {
    this.appStateStore = new Store({
      name: 'WLED App State',
      ...createState(withProps<AppStateProps>(DEFAULT_APP_STATE)),
    });
  }

  /** Set all app state fields using the api response data. */
  setAll = (response: WledApiResponse) => {
    this.appStateStore.update(({ localSettings, palettes, effects }) => ({
      state: {
        on: response.state.on,
        brightness: response.state.bri,
        // stored in backend as # of tenths of a second
        transition: response.state.transition / 10,
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
        shouldToggleReceiveWithSend: response.info.str,
        name: response.info.name,
        udpPort: response.info.udpport,
        isLive: response.info.live,
        lm: response.info.lm,
        sourceIpAddress: response.info.lip,
        webSocketCount: response.info.ws,
        effectCount: response.info.fxcount,
        paletteCount: response.info.palcount,
        wifi: {
          bssid: response.info.wifi.bssid,
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
      palettes: response.palettes ? response.palettes : palettes,
      effects: response.effects ? response.effects : effects,
      localSettings,
    }));
  }

  // getters
  getAppState = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n)
      .pipe<AppStateProps>(takeUntil(ngUnsubscribe));
  getState = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.state)
      .pipe<AppState>(takeUntil(ngUnsubscribe));
  getInfo = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info)
      .pipe<AppInfo>(takeUntil(ngUnsubscribe));
  // TODO remove individual getters
  getOn = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.state.on)
      .pipe<AppState['on']>(takeUntil(ngUnsubscribe));
  getBrightness = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.state.brightness)
      .pipe<AppState['brightness']>(takeUntil(ngUnsubscribe));
  getTransition = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.state.transition)
      .pipe<AppState['transition']>(takeUntil(ngUnsubscribe));
  getCurrentPresetId = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.state.currentPresetId)
      .pipe<AppState['currentPresetId']>(takeUntil(ngUnsubscribe));
  getCurrentPlaylistId = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.state.currentPlaylistId)
      .pipe<AppState['currentPlaylistId']>(takeUntil(ngUnsubscribe));
  getNightLight = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.state.nightLight)
      .pipe<AppState['nightLight']>(takeUntil(ngUnsubscribe));
  getUdp = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.state.udp)
      .pipe<AppState['udp']>(takeUntil(ngUnsubscribe));
  getLiveViewOverride = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.state.liveViewOverride)
      .pipe<AppState['liveViewOverride']>(takeUntil(ngUnsubscribe));
  getMainSegmentId = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.state.mainSegmentId)
      .pipe<AppState['mainSegmentId']>(takeUntil(ngUnsubscribe));
  getVersionName = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.versionName)
      .pipe<AppInfo['versionName']>(takeUntil(ngUnsubscribe));
  getVersionId = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.versionId)
      .pipe<AppInfo['versionId']>(takeUntil(ngUnsubscribe));
  getLedInfo = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.ledInfo)
      .pipe<AppInfo['ledInfo']>(takeUntil(ngUnsubscribe));
  getShouldToggleReceiveWithSend = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.shouldToggleReceiveWithSend)
      .pipe<AppInfo['shouldToggleReceiveWithSend']>(takeUntil(ngUnsubscribe));
  getName = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.name)
      .pipe<AppInfo['name']>(takeUntil(ngUnsubscribe));
  getUdpPort = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.udpPort)
      .pipe<AppInfo['udpPort']>(takeUntil(ngUnsubscribe));
  getIsLive = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.isLive)
      .pipe<AppInfo['isLive']>(takeUntil(ngUnsubscribe));
  // getLm = (ngUnsubscribe: Subject<void>) =>
  //   this.selectFromAppState((n) => n.info.lm)
  //     .pipe<AppStateInfo['lm']>(takeUntil(ngUnsubscribe));
  getSourceIpAddress = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.sourceIpAddress)
      .pipe<AppInfo['sourceIpAddress']>(takeUntil(ngUnsubscribe));
  getWebSocketCount = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.webSocketCount)
      .pipe<AppInfo['webSocketCount']>(takeUntil(ngUnsubscribe));
  getEffectCount = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.effectCount)
      .pipe<AppInfo['effectCount']>(takeUntil(ngUnsubscribe));
  getPaletteCount = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.paletteCount)
      .pipe<AppInfo['paletteCount']>(takeUntil(ngUnsubscribe));
  getWifi = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.wifi)
      .pipe<AppInfo['wifi']>(takeUntil(ngUnsubscribe));
  getFileSystem = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.fileSystem)
      .pipe<AppInfo['fileSystem']>(takeUntil(ngUnsubscribe));
  getWledDevicesOnNetwork = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.wledDevicesOnNetwork)
      .pipe<AppInfo['wledDevicesOnNetwork']>(takeUntil(ngUnsubscribe));
  getPlatform = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.platform)
      .pipe<AppInfo['platform']>(takeUntil(ngUnsubscribe));
  getArduinoVersion = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.arduinoVersion)
      .pipe<AppInfo['arduinoVersion']>(takeUntil(ngUnsubscribe));
  getFreeHeapBytes = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.freeHeapBytes)
      .pipe<AppInfo['freeHeapBytes']>(takeUntil(ngUnsubscribe));
  getUptimeSeconds = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.uptimeSeconds)
      .pipe<AppInfo['uptimeSeconds']>(takeUntil(ngUnsubscribe));
  // getOpt = (ngUnsubscribe: Subject<void>) =>
  //   this.selectFromAppState((n) => n.info.opt)
  //     .pipe<AppStateInfo['opt']>(takeUntil(ngUnsubscribe));
  getBrand = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.brand)
      .pipe<AppInfo['brand']>(takeUntil(ngUnsubscribe));
  getProductName = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.productName)
      .pipe<AppInfo['productName']>(takeUntil(ngUnsubscribe));
  getMacAddress = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.macAddress)
      .pipe<AppInfo['macAddress']>(takeUntil(ngUnsubscribe));
  getIpAddress = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.ipAddress)
      .pipe<AppInfo['ipAddress']>(takeUntil(ngUnsubscribe));
  getPalettes = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.palettes)
      .pipe<AppStateProps['palettes']>(takeUntil(ngUnsubscribe));
  getEffects = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.effects)
      .pipe<AppStateProps['effects']>(takeUntil(ngUnsubscribe));
  getLocalSettings = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.localSettings)
      .pipe<AppStateProps['localSettings']>(takeUntil(ngUnsubscribe));
  getIsLiveViewActive = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.localSettings.isLiveViewActive)
      .pipe<AppLocalSettings['isLiveViewActive']>(takeUntil(ngUnsubscribe));
  getSelectedWledIpAddress = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.localSettings.selectedWledIpAddress)
      .pipe<AppLocalSettings['selectedWledIpAddress']>(takeUntil(ngUnsubscribe));
  getWledIpAddresses = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.localSettings.wledIpAddresses)
      .pipe<AppLocalSettings['wledIpAddresses']>(takeUntil(ngUnsubscribe));

  // setters
  setOn = (on: AppState['on']) =>
    this.updateState({ on });
  setBrightness = (brightness: AppState['brightness']) =>
    this.updateState({ brightness });
  setTransition = (transition: AppState['transition']) =>
    this.updateState({ transition });
  setCurrentPresetId = (currentPresetId: AppState['currentPresetId']) =>
    this.updateState({ currentPresetId });
  setCurrentPlaylistId = (currentPlaylistId: AppState['currentPlaylistId']) =>
    this.updateState({ currentPlaylistId });
  setNightLight = (nightLight: AppState['nightLight']) =>
    this.updateState({ nightLight });
  setUdp = (udp: AppState['udp']) =>
    this.updateState({ udp });
  setLiveViewOverride = (liveViewOverride: AppState['liveViewOverride']) =>
    this.updateState({ liveViewOverride });
  setMainSegmentId = (mainSegmentId: AppState['mainSegmentId']) =>
    this.updateState({ mainSegmentId });
  setVersionName = (versionName: AppInfo['versionName']) =>
    this.updateInfo({ versionName });
  setVersionId = (versionId: AppInfo['versionId']) =>
    this.updateInfo({ versionId });
  setLedInfo = (ledInfo: AppInfo['ledInfo']) =>
    this.updateInfo({ ledInfo });
  setShouldToggleReceiveWithSend = (shouldToggleReceiveWithSend: AppInfo['shouldToggleReceiveWithSend']) =>
    this.updateInfo({ shouldToggleReceiveWithSend });
  setName = (name: AppInfo['name']) =>
    this.updateInfo({ name });
  setUdpPort = (udpPort: AppInfo['udpPort']) =>
    this.updateInfo({ udpPort });
  setIsLive = (isLive: AppInfo['isLive']) =>
    this.updateInfo({ isLive });
  // setLm = (lm: AppStateInfo['lm']) =>
  //   this.updateInfo({ lm });
  setSourceIpAddress = (sourceIpAddress: AppInfo['sourceIpAddress']) =>
    this.updateInfo({ sourceIpAddress });
  setWebSocketCount = (webSocketCount: AppInfo['webSocketCount']) =>
    this.updateInfo({ webSocketCount });
  setEffectCount = (effectCount: AppInfo['effectCount']) =>
    this.updateInfo({ effectCount });
  setPaletteCount = (paletteCount: AppInfo['paletteCount']) =>
    this.updateInfo({ paletteCount });
  setWifi = (wifi: AppInfo['wifi']) =>
    this.updateInfo({ wifi });
  setFileSystem = (fileSystem: AppInfo['fileSystem']) =>
    this.updateInfo({ fileSystem });
  setWledDevicesOnNetwork = (wledDevicesOnNetwork: AppInfo['wledDevicesOnNetwork']) =>
    this.updateInfo({ wledDevicesOnNetwork });
  setPlatform = (platform: AppInfo['platform']) =>
    this.updateInfo({ platform });
  setArduinoVersion = (arduinoVersion: AppInfo['arduinoVersion']) =>
    this.updateInfo({ arduinoVersion });
  setFreeHeapBytes = (freeHeapBytes: AppInfo['freeHeapBytes']) =>
    this.updateInfo({ freeHeapBytes });
  setUptimeSeconds = (uptimeSeconds: AppInfo['uptimeSeconds']) =>
    this.updateInfo({ uptimeSeconds });
  // setOpt = (opt: AppStateInfo['opt']) =>
  //   this.updateInfo({ opt });
  setBrand = (brand: AppInfo['brand']) =>
    this.updateInfo({ brand });
  setProductName = (productName: AppInfo['productName']) =>
    this.updateInfo({ productName });
  setMacAddress = (macAddress: AppInfo['macAddress']) =>
    this.updateInfo({ macAddress });
  setIpAddress = (ipAddress: AppInfo['ipAddress']) =>
    this.updateInfo({ ipAddress });
  setPalettes = (palettes: AppStateProps['palettes']) =>
    this.updatePalettes(palettes);
  setEffects = (effects: AppStateProps['effects']) =>
    this.updateEffects(effects);
  setLocalSettings = (localSettings: Partial<AppStateProps['localSettings']>) =>
    this.updateLocalSettings(localSettings);
  setIsLiveViewActive = (isLiveViewActive: AppLocalSettings['isLiveViewActive']) =>
    this.updateLocalSettings({ isLiveViewActive });
  setSelectedWledIpAddress = (selectedWledIpAddress: AppLocalSettings['selectedWledIpAddress']) =>
    this.updateLocalSettings({ selectedWledIpAddress });
  setWledIpAddresses = (wledIpAddresses: AppLocalSettings['wledIpAddresses']) =>
    this.updateLocalSettings({ wledIpAddresses });

  private selectFromAppState = (selectFn: (state: AppStateProps) => any) =>
    this.appStateStore.pipe(select(selectFn));

  private updateState = (newState: Partial<AppState>) => {
    this.appStateStore.update((appState) => ({
      ...appState,
      state: {
        ...appState.state,
        ...newState,
      },
    }));
  }

  private updateInfo = (newInfo: Partial<AppInfo>) => {
    this.appStateStore.update((appState) => ({
      ...appState,
      info: {
        ...appState.info,
        ...newInfo,
      },
    }));
  }

  private updatePalettes = (newPalettes: string[]) => {
    this.appStateStore.update((appState) => ({
      ...appState,
      palettes: newPalettes,
    }));
  }

  private updateEffects = (newEffects: string[]) => {
    this.appStateStore.update((appState) => ({
      ...appState,
      effects: newEffects,
    }));
  }

  private updateLocalSettings = (newLocalSettings: Partial<AppLocalSettings>) => {
    this.appStateStore.update((appState) => ({
      ...appState,
      localSettings: {
        ...appState.localSettings,
        ...newLocalSettings,
      },
    }));
  }
}
