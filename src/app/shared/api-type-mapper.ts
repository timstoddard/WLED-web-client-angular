import { Injectable } from '@angular/core';
import { WledApiResponse, WledFileSystemInfo, WledInfo, WledLedInfo, WledNightLightState, WledNodesResponse, WledSegment, WledState, WledUdpState, WledWifiInfo } from './api-types';
import { AppFileSystemInfo, AppInfo, AppLedInfo, AppNightLightState, AppWledState, AppState, AppUdpState, AppWifiInfo, AppNode, AppSegment } from './app-types';
import { ClientOnlyFieldsService, createDefaultSegmentFields } from './client-only-fields.service';

@Injectable({ providedIn: 'root' })
export class ApiTypeMapper {
  constructor(private clientOnlyFieldsService: ClientOnlyFieldsService) {
  }

  /** Maps an entire WLED API response into the format expected by this app. */
  mapWledApiResponseToAppState = (
    { state, info, palettes, effects }: WledApiResponse,
    existingState: AppState,
  ): AppState => ({
    ...existingState,
    state: this.mapWledStateToAppWledState(state),
    info: this.mapWledInfoToAppInfo(info),
    palettes: palettes ?? existingState.palettes,
    effects: effects ?? existingState.effects,
  });

  /** Maps the `state` object in the WLED API resonse into the format expected by this app. */
  mapWledStateToAppWledState = (state: WledState): AppWledState => ({
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
    segments: this.mapWledSegmentsToAppSegments(state.seg),
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

  mapWledSegmentsToAppSegments = (segments: WledSegment[]): AppSegment[] => {
    const {
      ids: segmentIds,
    } = this.normalizeIds<WledSegment>(segments, 'id');

    // read client only fields to join with API data
    const segmentFieldsMap = this.clientOnlyFieldsService.getSegmentFieldsMap();

    return segments.map((segment, i) => {
      const id = segmentIds[i];

      if (!segmentFieldsMap[id]) {
        segmentFieldsMap[id] = createDefaultSegmentFields();
      }

      const clientOnlyFields = segmentFieldsMap[id];
      const isExpanded = clientOnlyFields?.isExpanded || false;

      return {
        id,
        isExpanded,
        start: segment.start,
        stop: segment.stop,
        length: segment.len,
        group: segment.grp,
        space: segment.spc,
        startOffset: segment.of,
        colors: segment.col,
        effectId: segment.fx,
        effectSpeed: segment.sx,
        effectIntensity: segment.ix,
        paletteId: segment.pal,
        isSelected: segment.sel,
        isReversed: segment.rev,
        isOn: segment.on,
        brightness: segment.bri,
        name: segment.n,
        colorTemp: segment.cct,
        isMirrored: segment.mi,
        // TODO revisit these fields (see api types)
        // loxonePrimaryRgb: segment.lx,
        // loxoneSecondaryRgb: segment.ly,
      }
    });
  }

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
    rssi: wifiInfo.rssi,
    signalStrength: wifiInfo.signal,
    channel: wifiInfo.channel,
  });

  mapWledFileSystemInfoToAppFileSystemInfo = (fileSystemInfo: WledFileSystemInfo): AppFileSystemInfo => ({
    usedSpaceKb: fileSystemInfo.u,
    totalSpaceKb: fileSystemInfo.t,
    lastPresetsJsonEditTimestamp: fileSystemInfo.pmt,
  });

  mapWledNodesToAppNodes = ({ nodes }: WledNodesResponse): AppNode[] =>
    nodes.map(node => ({
      name: node.name,
      ipAddress: node.ip,
      type: node.type,
      versionId: node.vid,
    }));

  // TODO create an external ID service
  normalizeIds = <T>(items: T[], idField: keyof T) => {
    // TODO api segment id will never be 0 right?
    let lowestUnusedId = 1;
    let existingIdsIndex = 0;
    const ids: number[] = [];

    const existingIds = items
      .map((item) => item[idField])
      .filter(id => id !== undefined);
    // sort by ascending
    existingIds.sort((a, b) => (a as number)! - (b as number)!);
    for (const item of items) {
      let id: number;
      if (typeof item[idField] === 'number') {
        id = item[idField] as number;
      } else {
        // find next available ID
        while (lowestUnusedId === existingIds[existingIdsIndex]) {
          lowestUnusedId++;
          existingIdsIndex++;
        }
        id = lowestUnusedId;
        lowestUnusedId++;
      }
      ids.push(id);
    }

    // find next available ID
    while (lowestUnusedId === existingIds[existingIdsIndex]) {
      lowestUnusedId++;
      existingIdsIndex++;
    }

    return {
      ids,
      nextId: lowestUnusedId,
    };
  }
}
