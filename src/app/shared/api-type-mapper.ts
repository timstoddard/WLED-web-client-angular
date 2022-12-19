import { Injectable } from '@angular/core';
import { WLEDFileSystemInfo, WLEDInfo, WLEDLedInfo, WLEDWifiInfo } from './api-types/api-info';
import { WLEDNodesResponse } from './api-types/api-nodes';
import { WLEDPreset, WLEDPresets } from './api-types/api-presets';
import { WLEDNightLightState, WLEDSegment, WLEDState, WLEDUdpState } from './api-types/api-state';
import { WLEDApiResponse } from './api-types/api-types';
import { AppFileSystemInfo, AppInfo, AppLedInfo, AppWifiInfo } from './app-types/app-info';
import { AppNode } from './app-types/app-nodes';
import { AppPreset } from './app-types/app-presets';
import { AppNightLightState, AppSegment, AppUdpState, AppWLEDState } from './app-types/app-state';
import { AppState } from './app-types/app-types';
import { ClientOnlyFieldsService, createDefaultSegmentFields } from './client-only-fields.service';

@Injectable({ providedIn: 'root' })
export class ApiTypeMapper {
  constructor(private clientOnlyFieldsService: ClientOnlyFieldsService) {
  }

  /** Maps an entire WLED API response into the format expected by this app. */
  mapWLEDApiResponseToAppState = (
    existingState: AppState,
    { state, info, palettes, effects }: WLEDApiResponse,
    presets?: WLEDPresets,
  ): AppState => ({
    ...existingState,
    state: this.mapWLEDStateToAppWLEDState(state),
    info: this.mapWLEDInfoToAppInfo(info),
    palettes: palettes ?? existingState.palettes,
    effects: effects
      ? this.filterWLEDEffects(effects)
      : existingState.effects,
    presets: presets
      ? this.mapWLEDPresetsToAppPresets(presets)
      : existingState.presets,
  });

  /** Maps the `state` object in the WLED API resonse into the format expected by this app. */
  mapWLEDStateToAppWLEDState = (state: WLEDState): AppWLEDState => ({
    on: state.on,
    brightness: state.bri,
    // stored in backend as # of tenths of a second, so we
    // must convert it to seconds for the frontend
    transition: state.transition / 10,
    currentPresetId: state.ps,
    currentPlaylistId: state.pl,
    nightLight: this.mapWLEDNightLightToAppNightLight(state.nl),
    udp: this.mapWLEDUdpToAppUdp(state.udpn),
    liveViewOverride: state.lor,
    mainSegmentId: state.mainseg,
    segments: this.mapWLEDSegmentsToAppSegments(state.seg),
  });

  mapWLEDNightLightToAppNightLight = (nightLight: WLEDNightLightState): AppNightLightState => ({
    on: nightLight.on,
    durationMinutes: nightLight.dur,
    mode: nightLight.mode,
    targetBrightness: nightLight.tbri,
    remainingSeconds: nightLight.rem,
  });

  mapWLEDUdpToAppUdp = (udp: WLEDUdpState): AppUdpState => ({
    shouldSend: udp.send,
    shouldReceive: udp.recv,
  });

  mapWLEDSegmentsToAppSegments = (segments: WLEDSegment[]): AppSegment[] => {
    const {
      ids: segmentIds,
    } = this.normalizeIds<WLEDSegment>(segments, 'id');

    // read client only fields to join with API data
    const segmentFieldsMap = this.clientOnlyFieldsService.getSegmentFieldsMap();

    return segments.map((segment, i) => {
      const id = segmentIds[i];

      if (!segmentFieldsMap[id]) {
        segmentFieldsMap[id] = createDefaultSegmentFields();
      }

      const clientOnlyFields = segmentFieldsMap[id];
      const isExpanded = clientOnlyFields?.isExpanded || false;

      const appSegment: AppSegment = {
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
        isMirrored: segment.mi,
        colorTemp: segment.cct,
        loxonePrimaryColor: segment.lx,
        loxoneSecondaryColor: segment.ly,
        isFrozen: segment.frz,
        name: '', // TODO
      };

      return appSegment;
    });
  }

  /** Maps the `info` object in the WLED API resonse into the format expected by this app. */
  mapWLEDInfoToAppInfo = (info: WLEDInfo): AppInfo => ({
    versionName: info.ver,
    versionId: info.vid,
    ledInfo: this.mapWLEDLedInfoToAppLedInfo(info.leds),
    shouldToggleReceiveWithSend: info.str,
    name: info.name,
    udpPort: info.udpport,
    isLive: info.live,
    lm: info.lm,
    sourceIpAddress: info.lip,
    webSocketCount: info.ws,
    effectCount: info.fxcount,
    paletteCount: info.palcount,
    wifi: this.mapWLEDWifiInfoToAppWifiInfo(info.wifi),
    fileSystem: this.mapWLEDFileSystemInfoToAppFileSystemInfo(info.fs),
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

  filterWLEDEffects = (effects: string[]) => effects
    // filter unsupported effects https://kno.wled.ge/interfaces/json-api/
    .filter(effect => !['RSVD', '-'].includes(effect))

  mapWLEDLedInfoToAppLedInfo = (ledInfo: WLEDLedInfo): AppLedInfo => ({
    totalLeds: ledInfo.count,
    fps: ledInfo.fps,
    amps: ledInfo.pwr,
    maxAmps: ledInfo.maxpwr,
    maxSegments: ledInfo.maxseg,
    lightCapabilities: ledInfo.lc,
    segmentLightCapabilities: ledInfo.seglc,
  });

  mapWLEDWifiInfoToAppWifiInfo = (wifiInfo: WLEDWifiInfo): AppWifiInfo => ({
    bssid: wifiInfo.bssid,
    rssi: wifiInfo.rssi,
    signalStrength: wifiInfo.signal,
    channel: wifiInfo.channel,
  });

  mapWLEDFileSystemInfoToAppFileSystemInfo = (fileSystemInfo: WLEDFileSystemInfo): AppFileSystemInfo => ({
    usedSpaceKb: fileSystemInfo.u,
    totalSpaceKb: fileSystemInfo.t,
    presetsJsonLastEditTimestamp: fileSystemInfo.pmt,
  });

  mapWLEDNodesToAppNodes = ({ nodes }: WLEDNodesResponse): AppNode[] =>
    nodes.map(node => ({
      name: node.name,
      ipAddress: node.ip,
      type: node.type,
      versionId: node.vid,
    }));

  mapWLEDPresetsToAppPresets = (presets: WLEDPresets) => {
    // delete empty default preset
    delete presets[0];

    const getApiValue = (preset: WLEDPreset) => {
      const presetCopy: Partial<WLEDPreset> = { ...preset };
      delete presetCopy.n;
      delete presetCopy.ql;
      return JSON.stringify(presetCopy);
    }

    // convert presets to list
    const appPresets: AppPreset[] = [];
    for (const presetId in presets) {
      const preset = presets[presetId];
      appPresets.push({
        id: parseInt(presetId, 10),
        name: preset.n,
        quickLoadLabel: preset.ql,
        apiValue: getApiValue(preset),
        isExpanded: false,
      });
    }

    // sort presets by id ascending
    appPresets.sort((a: AppPreset, b: AppPreset) => a.id - b.id);

    return appPresets;
  }

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
