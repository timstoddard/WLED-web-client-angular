import { Injectable } from '@angular/core';
import { Store, createState, withProps, select } from '@ngneat/elf';
import { Subject, takeUntil } from 'rxjs';
import { WledApiResponse } from '../api-types';

// TODO create entity store for segments
// TODO create entity store for palettes
// TODO create entity store for effects

interface AppStateProps {
  state: AppStateState;
  info: AppStateInfo;
}

interface AppStateState {
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

interface AppStateInfo {
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
  isLive: boolean;
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
};

const { state, config } = createState(withProps<AppStateProps>(DEFAULT_APP_STATE));
const appStateStore = new Store({ name: 'WLED App State', state, config });

@Injectable({ providedIn: 'root' })
export class AppStateService {
  /** Set all app state fields using the api response data. */
  setAll = (response: WledApiResponse) => {
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
    }));
  }

  // getters
  getAppState = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n)
      .pipe<AppStateProps>(takeUntil(ngUnsubscribe));
  getOn = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.state.on)
      .pipe<AppStateState['on']>(takeUntil(ngUnsubscribe));
  getBrightness = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.state.brightness)
      .pipe<AppStateState['brightness']>(takeUntil(ngUnsubscribe));
  getTransition = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.state.transition)
      .pipe<AppStateState['transition']>(takeUntil(ngUnsubscribe));
  getCurrentPresetId = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.state.currentPresetId)
      .pipe<AppStateState['currentPresetId']>(takeUntil(ngUnsubscribe));
  getCurrentPlaylistId = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.state.currentPlaylistId)
      .pipe<AppStateState['currentPlaylistId']>(takeUntil(ngUnsubscribe));
  getNightLight = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.state.nightLight)
      .pipe<AppStateState['nightLight']>(takeUntil(ngUnsubscribe));
  getUdp = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.state.udp)
      .pipe<AppStateState['udp']>(takeUntil(ngUnsubscribe));
  getLiveViewOverride = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.state.liveViewOverride)
      .pipe<AppStateState['liveViewOverride']>(takeUntil(ngUnsubscribe));
  getMainSegmentId = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.state.mainSegmentId)
      .pipe<AppStateState['mainSegmentId']>(takeUntil(ngUnsubscribe));
  getVersionName = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.versionName)
      .pipe<AppStateInfo['versionName']>(takeUntil(ngUnsubscribe));
  getVersionId = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.versionId)
      .pipe<AppStateInfo['versionId']>(takeUntil(ngUnsubscribe));
  getLedInfo = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.ledInfo)
      .pipe<AppStateInfo['ledInfo']>(takeUntil(ngUnsubscribe));
  getShouldToggleReceiveWithSend = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.shouldToggleReceiveWithSend)
      .pipe<AppStateInfo['shouldToggleReceiveWithSend']>(takeUntil(ngUnsubscribe));
  getName = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.name)
      .pipe<AppStateInfo['name']>(takeUntil(ngUnsubscribe));
  getUdpPort = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.udpPort)
      .pipe<AppStateInfo['udpPort']>(takeUntil(ngUnsubscribe));
  getIsLive = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.isLive)
      .pipe<AppStateInfo['isLive']>(takeUntil(ngUnsubscribe));
  // getLm = (ngUnsubscribe: Subject<void>) =>
  //   this.selectFromAppState((n) => n.info.lm)
  //     .pipe<AppStateInfo['lm']>(takeUntil(ngUnsubscribe));
  getSourceIpAddress = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.sourceIpAddress)
      .pipe<AppStateInfo['sourceIpAddress']>(takeUntil(ngUnsubscribe));
  getWebSocketCount = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.webSocketCount)
      .pipe<AppStateInfo['webSocketCount']>(takeUntil(ngUnsubscribe));
  getEffectCount = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.effectCount)
      .pipe<AppStateInfo['effectCount']>(takeUntil(ngUnsubscribe));
  getPaletteCount = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.paletteCount)
      .pipe<AppStateInfo['paletteCount']>(takeUntil(ngUnsubscribe));
  getWifi = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.wifi)
      .pipe<AppStateInfo['wifi']>(takeUntil(ngUnsubscribe));
  getFileSystem = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.fileSystem)
      .pipe<AppStateInfo['fileSystem']>(takeUntil(ngUnsubscribe));
  getWledDevicesOnNetwork = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.wledDevicesOnNetwork)
      .pipe<AppStateInfo['wledDevicesOnNetwork']>(takeUntil(ngUnsubscribe));
  getPlatform = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.platform)
      .pipe<AppStateInfo['platform']>(takeUntil(ngUnsubscribe));
  getArduinoVersion = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.arduinoVersion)
      .pipe<AppStateInfo['arduinoVersion']>(takeUntil(ngUnsubscribe));
  getFreeHeapBytes = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.freeHeapBytes)
      .pipe<AppStateInfo['freeHeapBytes']>(takeUntil(ngUnsubscribe));
  getUptimeSeconds = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.uptimeSeconds)
      .pipe<AppStateInfo['uptimeSeconds']>(takeUntil(ngUnsubscribe));
  // getOpt = (ngUnsubscribe: Subject<void>) =>
  //   this.selectFromAppState((n) => n.info.opt)
  //     .pipe<AppStateInfo['opt']>(takeUntil(ngUnsubscribe));
  getBrand = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.brand)
      .pipe<AppStateInfo['brand']>(takeUntil(ngUnsubscribe));
  getProductName = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.productName)
      .pipe<AppStateInfo['productName']>(takeUntil(ngUnsubscribe));
  getMacAddress = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.macAddress)
      .pipe<AppStateInfo['macAddress']>(takeUntil(ngUnsubscribe));
  getIpAddress = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info.ipAddress)
      .pipe<AppStateInfo['ipAddress']>(takeUntil(ngUnsubscribe));

  // setters
  setOn = (on: AppStateState['on']) =>
    this.updateState({ on });
  setBrightness = (brightness: AppStateState['brightness']) =>
    this.updateState({ brightness });
  setTransition = (transition: AppStateState['transition']) =>
    this.updateState({ transition });
  setCurrentPresetId = (currentPresetId: AppStateState['currentPresetId']) =>
    this.updateState({ currentPresetId });
  setCurrentPlaylistId = (currentPlaylistId: AppStateState['currentPlaylistId']) =>
    this.updateState({ currentPlaylistId });
  setNightLight = (nightLight: AppStateState['nightLight']) =>
    this.updateState({ nightLight });
  setUdp = (udp: AppStateState['udp']) =>
    this.updateState({ udp });
  setLiveViewOverride = (liveViewOverride: AppStateState['liveViewOverride']) =>
    this.updateState({ liveViewOverride });
  setMainSegmentId = (mainSegmentId: AppStateState['mainSegmentId']) =>
    this.updateState({ mainSegmentId });
  setVersionName = (versionName: AppStateInfo['versionName']) =>
    this.updateInfo({ versionName });
  setVersionId = (versionId: AppStateInfo['versionId']) =>
    this.updateInfo({ versionId });
  setLedInfo = (ledInfo: AppStateInfo['ledInfo']) =>
    this.updateInfo({ ledInfo });
  setShouldToggleReceiveWithSend = (shouldToggleReceiveWithSend: AppStateInfo['shouldToggleReceiveWithSend']) =>
    this.updateInfo({ shouldToggleReceiveWithSend });
  setName = (name: AppStateInfo['name']) =>
    this.updateInfo({ name });
  setUdpPort = (udpPort: AppStateInfo['udpPort']) =>
    this.updateInfo({ udpPort });
  setIsLive = (isLive: AppStateInfo['isLive']) =>
    this.updateInfo({ isLive });
  // setLm = (lm: AppStateInfo['lm']) =>
  //   this.updateInfo({ lm });
  setSourceIpAddress = (sourceIpAddress: AppStateInfo['sourceIpAddress']) =>
    this.updateInfo({ sourceIpAddress });
  setWebSocketCount = (webSocketCount: AppStateInfo['webSocketCount']) =>
    this.updateInfo({ webSocketCount });
  setEffectCount = (effectCount: AppStateInfo['effectCount']) =>
    this.updateInfo({ effectCount });
  setPaletteCount = (paletteCount: AppStateInfo['paletteCount']) =>
    this.updateInfo({ paletteCount });
  setWifi = (wifi: AppStateInfo['wifi']) =>
    this.updateInfo({ wifi });
  setFileSystem = (fileSystem: AppStateInfo['fileSystem']) =>
    this.updateInfo({ fileSystem });
  setWledDevicesOnNetwork = (wledDevicesOnNetwork: AppStateInfo['wledDevicesOnNetwork']) =>
    this.updateInfo({ wledDevicesOnNetwork });
  setPlatform = (platform: AppStateInfo['platform']) =>
    this.updateInfo({ platform });
  setArduinoVersion = (arduinoVersion: AppStateInfo['arduinoVersion']) =>
    this.updateInfo({ arduinoVersion });
  setFreeHeapBytes = (freeHeapBytes: AppStateInfo['freeHeapBytes']) =>
    this.updateInfo({ freeHeapBytes });
  setUptimeSeconds = (uptimeSeconds: AppStateInfo['uptimeSeconds']) =>
    this.updateInfo({ uptimeSeconds });
  // setOpt = (opt: AppStateInfo['opt']) =>
  //   this.updateInfo({ opt });
  setBrand = (brand: AppStateInfo['brand']) =>
    this.updateInfo({ brand });
  setProductName = (productName: AppStateInfo['productName']) =>
    this.updateInfo({ productName });
  setMacAddress = (macAddress: AppStateInfo['macAddress']) =>
    this.updateInfo({ macAddress });
  setIpAddress = (ipAddress: AppStateInfo['ipAddress']) =>
    this.updateInfo({ ipAddress });

  private selectFromAppState = (selectFn: (state: AppStateProps) => any) =>
    appStateStore.pipe(select(selectFn));

  private updateState = (newState: Partial<AppStateState>) => {
    appStateStore.update((n) => ({
      state: { ...n.state, ...newState },
      info: n.info,
    }));
  }

  private updateInfo = (newInfo: Partial<AppStateInfo>) => {
    appStateStore.update((n) => ({
      state: n.state,
      info: { ...n.info, ...newInfo },
    }));
  }
}
