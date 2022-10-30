import { Injectable } from '@angular/core';
import { Store, createState, withProps, select } from '@ngneat/elf';
import { Subject, takeUntil } from 'rxjs';
import { ApiTypeMapper } from '../api-type-mapper';
import { WledApiResponse, WledNodesResponse } from '../api-types';
import { AppInfo, AppLocalSettings, AppWledState, AppState } from '../app-types';
import { DEFAULT_APP_STATE } from './app-state-defaults';

@Injectable({ providedIn: 'root' })
export class AppStateService {
  private appStateStore: Store;

  constructor(private apiTypeMapper: ApiTypeMapper) {
    this.appStateStore = new Store({
      name: 'WLED App State',
      ...createState(withProps<AppState>(DEFAULT_APP_STATE)),
    });
  }

  /** Set all app state fields using the api response data. */
  setAll = (response: WledApiResponse) => {
    this.appStateStore.update((state) =>
      this.apiTypeMapper.mapWledApiResponseToAppStateProps(response, state));
  }

  /** Updates nodes data. */
  setNodes = (response: WledNodesResponse) => {
    this.appStateStore.update((state) => ({
      ...state,
      nodes: this.apiTypeMapper.mapWledNodesToAppNodes(response),
    }));
  };

  // getters
  getAppState = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n)
      .pipe<AppState>(takeUntil(ngUnsubscribe));
  getWledState = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.state)
      .pipe<AppWledState>(takeUntil(ngUnsubscribe));
  getInfo = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.info)
      .pipe<AppInfo>(takeUntil(ngUnsubscribe));
  // TODO remove individual getters
  getOn = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.state.on)
      .pipe<AppWledState['on']>(takeUntil(ngUnsubscribe));
  getBrightness = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.state.brightness)
      .pipe<AppWledState['brightness']>(takeUntil(ngUnsubscribe));
  getTransition = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.state.transition)
      .pipe<AppWledState['transition']>(takeUntil(ngUnsubscribe));
  getCurrentPresetId = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.state.currentPresetId)
      .pipe<AppWledState['currentPresetId']>(takeUntil(ngUnsubscribe));
  getCurrentPlaylistId = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.state.currentPlaylistId)
      .pipe<AppWledState['currentPlaylistId']>(takeUntil(ngUnsubscribe));
  getNightLight = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.state.nightLight)
      .pipe<AppWledState['nightLight']>(takeUntil(ngUnsubscribe));
  getUdp = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.state.udp)
      .pipe<AppWledState['udp']>(takeUntil(ngUnsubscribe));
  getLiveViewOverride = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.state.liveViewOverride)
      .pipe<AppWledState['liveViewOverride']>(takeUntil(ngUnsubscribe));
  getMainSegmentId = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.state.mainSegmentId)
      .pipe<AppWledState['mainSegmentId']>(takeUntil(ngUnsubscribe));
  getSegments = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.state.mainSegmentId)
      .pipe<AppWledState['segments']>(takeUntil(ngUnsubscribe));
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
      .pipe<AppState['palettes']>(takeUntil(ngUnsubscribe));
  getEffects = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.effects)
      .pipe<AppState['effects']>(takeUntil(ngUnsubscribe));
  getLocalSettings = (ngUnsubscribe: Subject<void>) =>
    this.selectFromAppState((n) => n.localSettings)
      .pipe<AppState['localSettings']>(takeUntil(ngUnsubscribe));
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
  setOn = (on: AppWledState['on']) =>
    this.updateState({ on });
  setBrightness = (brightness: AppWledState['brightness']) =>
    this.updateState({ brightness });
  setTransition = (transition: AppWledState['transition']) =>
    this.updateState({ transition });
  setCurrentPresetId = (currentPresetId: AppWledState['currentPresetId']) =>
    this.updateState({ currentPresetId });
  setCurrentPlaylistId = (currentPlaylistId: AppWledState['currentPlaylistId']) =>
    this.updateState({ currentPlaylistId });
  setNightLight = (nightLight: AppWledState['nightLight']) =>
    this.updateState({ nightLight });
  setUdp = (udp: AppWledState['udp']) =>
    this.updateState({ udp });
  setLiveViewOverride = (liveViewOverride: AppWledState['liveViewOverride']) =>
    this.updateState({ liveViewOverride });
  setMainSegmentId = (mainSegmentId: AppWledState['mainSegmentId']) =>
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
  setPalettes = (palettes: AppState['palettes']) =>
    this.updatePalettes(palettes);
  setEffects = (effects: AppState['effects']) =>
    this.updateEffects(effects);
  setLocalSettings = (localSettings: Partial<AppState['localSettings']>) =>
    this.updateLocalSettings(localSettings);
  setIsLiveViewActive = (isLiveViewActive: AppLocalSettings['isLiveViewActive']) =>
    this.updateLocalSettings({ isLiveViewActive });
  setSelectedWledIpAddress = (selectedWledIpAddress: AppLocalSettings['selectedWledIpAddress']) =>
    this.updateLocalSettings({ selectedWledIpAddress });
  setWledIpAddresses = (wledIpAddresses: AppLocalSettings['wledIpAddresses']) =>
    this.updateLocalSettings({ wledIpAddresses });

  private selectFromAppState = (selectFn: (state: AppState) => any) =>
    // TODO handle unsubscribing here
    this.appStateStore.pipe(select(selectFn));

  updateState = (newState: Partial<AppWledState>) => {
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
