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

  // getters
  getAppState = () => this.selectFromAppState((n) => n);
  getOn = () => this.selectFromAppState((n) => n.state.on);
  getBrightness = () => this.selectFromAppState((n) => n.state.brightness);
  getTransition = () => this.selectFromAppState((n) => n.state.transition);
  getCurrentPresetId = () => this.selectFromAppState((n) => n.state.currentPresetId);
  getCurrentPlaylistId = () => this.selectFromAppState((n) => n.state.currentPlaylistId);
  getNightLight = () => this.selectFromAppState((n) => n.state.nightLight);
  getUdp = () => this.selectFromAppState((n) => n.state.udp);
  getLiveViewOverride = () => this.selectFromAppState((n) => n.state.liveViewOverride);
  getMainSegmentId = () => this.selectFromAppState((n) => n.state.mainSegmentId);
  getVersionName = () => this.selectFromAppState((n) => n.info.versionName);
  getVersionId = () => this.selectFromAppState((n) => n.info.versionId);
  getLedInfo = () => this.selectFromAppState((n) => n.info.ledInfo);
  // getStr = () => this.selectFromAppState((n) => n.info.str);
  getName = () => this.selectFromAppState((n) => n.info.name);
  getUdpPort = () => this.selectFromAppState((n) => n.info.udpPort);
  getIsLive = () => this.selectFromAppState((n) => n.info.isLive);
  // getLm = () => this.selectFromAppState((n) => n.info.lm);
  getSourceIpAddress = () => this.selectFromAppState((n) => n.info.sourceIpAddress);
  getWebSocketCount = () => this.selectFromAppState((n) => n.info.webSocketCount);
  getEffectCount = () => this.selectFromAppState((n) => n.info.effectCount);
  getPaletteCount = () => this.selectFromAppState((n) => n.info.paletteCount);
  getWifi = () => this.selectFromAppState((n) => n.info.wifi);
  getFileSystem = () => this.selectFromAppState((n) => n.info.fileSystem);
  getWledDevicesOnNetwork = () => this.selectFromAppState((n) => n.info.wledDevicesOnNetwork);
  getPlatform = () => this.selectFromAppState((n) => n.info.platform);
  getArduinoVersion = () => this.selectFromAppState((n) => n.info.arduinoVersion);
  getFreeHeapBytes = () => this.selectFromAppState((n) => n.info.freeHeapBytes);
  getUptimeSeconds = () => this.selectFromAppState((n) => n.info.uptimeSeconds);
  // getOpt = () => this.selectFromAppState((n) => n.info.opt);
  getBrand = () => this.selectFromAppState((n) => n.info.brand);
  getProductName = () => this.selectFromAppState((n) => n.info.productName);
  getMacAddress = () => this.selectFromAppState((n) => n.info.macAddress);
  getIpAddress = () => this.selectFromAppState((n) => n.info.ipAddress);

  // setters
  setOn = (on: AppStateProps['state']['on']) => this.updateState({ on });
  setBrightness = (brightness: AppStateProps['state']['brightness']) => this.updateState({ brightness });
  setTransition = (transition: AppStateProps['state']['transition']) => this.updateState({ transition });
  setCurrentPresetId = (currentPresetId: AppStateProps['state']['currentPresetId']) => this.updateState({ currentPresetId });
  setCurrentPlaylistId = (currentPlaylistId: AppStateProps['state']['currentPlaylistId']) => this.updateState({ currentPlaylistId });
  setNightLight = (nightLight: AppStateProps['state']['nightLight']) => this.updateState({ nightLight });
  setUdp = (udp: AppStateProps['state']['udp']) => this.updateState({ udp });
  setLiveViewOverride = (liveViewOverride: AppStateProps['state']['liveViewOverride']) => this.updateState({ liveViewOverride });
  setMainSegmentId = (mainSegmentId: AppStateProps['state']['mainSegmentId']) => this.updateState({ mainSegmentId });
  setVersionName = (versionName: AppStateProps['info']['versionName']) => this.updateInfo({ versionName });
  setVersionId = (versionId: AppStateProps['info']['versionId']) => this.updateInfo({ versionId });
  setLedInfo = (ledInfo: AppStateProps['info']['ledInfo']) => this.updateInfo({ ledInfo });
  // setStr = (str: AppStateProps['info']['str']) => this.foo2({ str });
  setName = (name: AppStateProps['info']['name']) => this.updateInfo({ name });
  setUdpPort = (udpPort: AppStateProps['info']['udpPort']) => this.updateInfo({ udpPort });
  setIsLive = (isLive: AppStateProps['info']['isLive']) => this.updateInfo({ isLive });
  // setLm = (lm: AppStateProps['info']['lm']) => this.foo2({ lm });
  setSourceIpAddress = (sourceIpAddress: AppStateProps['info']['sourceIpAddress']) => this.updateInfo({ sourceIpAddress });
  setWebSocketCount = (webSocketCount: AppStateProps['info']['webSocketCount']) => this.updateInfo({ webSocketCount });
  setEffectCount = (effectCount: AppStateProps['info']['effectCount']) => this.updateInfo({ effectCount });
  setPaletteCount = (paletteCount: AppStateProps['info']['paletteCount']) => this.updateInfo({ paletteCount });
  setWifi = (wifi: AppStateProps['info']['wifi']) => this.updateInfo({ wifi });
  setFileSystem = (fileSystem: AppStateProps['info']['fileSystem']) => this.updateInfo({ fileSystem });
  setWledDevicesOnNetwork = (wledDevicesOnNetwork: AppStateProps['info']['wledDevicesOnNetwork']) => this.updateInfo({ wledDevicesOnNetwork });
  setPlatform = (platform: AppStateProps['info']['platform']) => this.updateInfo({ platform });
  setArduinoVersion = (arduinoVersion: AppStateProps['info']['arduinoVersion']) => this.updateInfo({ arduinoVersion });
  setFreeHeapBytes = (freeHeapBytes: AppStateProps['info']['freeHeapBytes']) => this.updateInfo({ freeHeapBytes });
  setUptimeSeconds = (uptimeSeconds: AppStateProps['info']['uptimeSeconds']) => this.updateInfo({ uptimeSeconds });
  // setOpt = (opt: AppStateProps['info']['opt']) => this.foo2({ opt });
  setBrand = (brand: AppStateProps['info']['brand']) => this.updateInfo({ brand });
  setProductName = (productName: AppStateProps['info']['productName']) => this.updateInfo({ productName });
  setMacAddress = (macAddress: AppStateProps['info']['macAddress']) => this.updateInfo({ macAddress });
  setIpAddress = (ipAddress: AppStateProps['info']['ipAddress']) => this.updateInfo({ ipAddress });

  private selectFromAppState = (selectFn: (state: AppStateProps) => unknown) =>
    appStateStore.pipe(select(selectFn));

  private updateState = (newState: Partial<AppStateProps['state']>) => {
    appStateStore.update((n) => ({
      state: { ...n.state, ...newState },
      info: n.info,
    }));
  }

  private updateInfo = (newInfo: Partial<AppStateProps['info']>) => {
    appStateStore.update((n) => ({
      state: n.state,
      info: { ...n.info, ...newInfo },
    }));
  }
}
