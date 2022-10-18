import { Injectable } from '@angular/core';
import { WledApiResponse, WledFileSystemInfo, WledInfo, WledLedInfo, WledNightLightState, WledState, WledUdpState, WledWifiInfo } from './api-types';
import { AppFileSystemInfo, AppInfo, AppLedInfo, AppLocalSettings, AppNightLightState, AppState, AppStateProps, AppUdpState, AppWifiInfo } from './app-types';

@Injectable({ providedIn: 'root' })
export class ApiTypeMapper {
  /** Maps an entire WLED API response into the format expected by this app. */
  mapWledApiResponseToAppStateProps = (
    { state, info, palettes, effects }: WledApiResponse,
    localSettings: AppLocalSettings,
    existingPalettes: string[],
    existingEffects: string[],
  ): AppStateProps => ({
    state: this.mapWledStateToAppState(state),
    info: this.mapWledInfoToAppInfo(info),
    palettes: palettes ?? existingPalettes,
    effects: effects ?? existingEffects,
    localSettings,
  });

  /** Maps the `state` object in the WLED API resonse into the format expected by this app. */
  mapWledStateToAppState = (state: WledState): AppState => ({
    on: state.on,
    brightness: state.bri,
    // stored in backend as # of tenths of a second, so we
    // must convert it to seconds for the frontend
    transition: state.transition / 10,
    currentPresetId: state.ps,
    currentPlaylistId: state.pl,
    nightLight: this.mapWledNightLightToAppNightLight(state.nl),
    udp: this.mapWledUdpToAppUdp(state.udpn),
    liveViewOverride: state.lor,
    mainSegmentId: state.mainseg,
    // TODO missing field from app state?
    // segment: state.seg,
  });

  mapWledNightLightToAppNightLight = (nightLight: WledNightLightState): AppNightLightState => ({
    on: nightLight.on,
    durationMinutes: nightLight.dur,
    mode: nightLight.mode,
    targetBrightness: nightLight.tbri,
    remainingSeconds: nightLight.rem,
  });

  mapWledUdpToAppUdp = (udp: WledUdpState): AppUdpState => ({
    shouldSend: udp.send,
    shouldReceive: udp.recv,
  });

  /** Maps the `info` object in the WLED API resonse into the format expected by this app. */
  mapWledInfoToAppInfo = (info: WledInfo): AppInfo => ({
    versionName: info.ver,
    versionId: info.vid,
    ledInfo: this.mapWledLedInfoToAppLedInfo(info.leds),
    shouldToggleReceiveWithSend: info.str,
    name: info.name,
    udpPort: info.udpport,
    isLive: info.live,
    lm: info.lm,
    sourceIpAddress: info.lip,
    webSocketCount: info.ws,
    effectCount: info.fxcount,
    paletteCount: info.palcount,
    wifi: this.mapWledWifiInfoToAppWifiInfo(info.wifi),
    fileSystem: this.mapWledFileSystemInfoToAppFileSystemInfo(info.fs),
    wledDevicesOnNetwork: info.ndc,
    platform: info.arch,
    arduinoVersion: info.core,
    freeHeapBytes: info.freeheap,
    uptimeSeconds: info.uptime,
    opt: info.opt,
    brand: info.brand,
    productName: info.product,
    macAddress: info.mac,
    ipAddress: info.ip,
  });

  mapWledLedInfoToAppLedInfo = (ledInfo: WledLedInfo): AppLedInfo => ({
    totalLeds: ledInfo.count,
    fps: ledInfo.fps,
    hasWhiteChannel: ledInfo.rgbw,
    showWhiteChannelSlider: ledInfo.wv,
    amps: ledInfo.pwr,
    maxAmps: ledInfo.maxpwr,
    maxSegments: ledInfo.maxseg,
  });

  mapWledWifiInfoToAppWifiInfo = (wifiInfo: WledWifiInfo): AppWifiInfo => ({
    bssid: wifiInfo.bssid,
    signalStrength: wifiInfo.signal,
    channel: wifiInfo.channel,
  });

  mapWledFileSystemInfoToAppFileSystemInfo = (fileSystemInfo: WledFileSystemInfo): AppFileSystemInfo => ({
    usedSpaceKb: fileSystemInfo.u,
    totalSpaceKb: fileSystemInfo.t,
    lastPresetsJsonEditTimestamp: fileSystemInfo.pmt,
  });
}
