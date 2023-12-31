import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { WledNetworkSettings, WledSecuritySettings, WledTimeSettings } from 'src/app/settings/shared/settings-types';
import { ApiFilePath, ApiPath } from './api-paths';
import { FormValues } from '../form-service';
import { MOCK_API_RESPONSE } from 'src/app/controls-wrapper/mock-api-data';

@Injectable({ providedIn: 'root' })
export class SettingsApiService {
  constructor(
    private apiService: ApiService,
  ) {
  }

  // TODO add get for LED settings
  // TODO add get for UI settings

  /** Submits LED settings form data to server. */
  setLedSettings = (ledSettings: FormValues) => {
    // TODO does this return WLEDApiResponse type or other type?
    return this.apiService.httpPost(
      ApiPath.LED_SETTINGS_PATH,
      ledSettings,
      MOCK_API_RESPONSE,
    );
  }

  /** Submits UI settings form data to server. */
  setUISettings = (uiSettings: FormValues) => {
    // TODO does this return WLEDApiResponse type or other type?
    return this.apiService.httpPost(
      ApiPath.UI_SETTINGS_PATH,
      uiSettings,
      MOCK_API_RESPONSE,
    );
  }

  /** Submits wifi settings form data to server. */
  setNetworkSettings = (wifiSettings: Partial<WledNetworkSettings>) => {
    // TODO does this return WLEDApiResponse type or other type?
    return this.apiService.httpPost(
      ApiPath.WIFI_SETTINGS_PATH,
      wifiSettings,
      MOCK_API_RESPONSE,
    );
  }

  /** Submits time settings form data to server. */
  setTimeSettings = (timeSettings: WledTimeSettings) => {
    return this.apiService.httpPost(
      ApiPath.TIME_SETTINGS_PATH,
      timeSettings,
      'Time settings saved.',
      { responseType: 'text' },
    );
  }

  /** Submits security settings form data to server. */
  setSecuritySettings = (securitySettings: WledSecuritySettings) => {
    // TODO this post doesn't work!!
    return this.apiService.httpPost(
      ApiPath.SECURITY_SETTINGS_PATH,
      securitySettings,
      'Security settings saved.',
      { responseType: 'text' },
    );
  }

  /** Reads network settings from the server. */
  getNetworkSettings = () => {
    const offlineDefault = `
      function GetV(){
        var d=document;
        d.Sf.CS.value="wifi network";d.Sf.CP.value="********";d.Sf.I0.value=0;d.Sf.G0.value=0;d.Sf.S0.value=255;d.Sf.I1.value=0;d.Sf.G1.value=0;d.Sf.S1.value=255;d.Sf.I2.value=0;d.Sf.G2.value=0;d.Sf.S2.value=255;d.Sf.I3.value=0;d.Sf.G3.value=0;d.Sf.S3.value=0;d.Sf.CM.value="wled-9518b4";d.Sf.AB.selectedIndex=0;d.Sf.AS.value="WLED-AP";d.Sf.AH.checked=0;d.Sf.AP.value="********";d.Sf.AC.value=1;d.Sf.WS.checked=1;document.getElementById('ethd').style.display='none';d.getElementsByClassName("sip")[0].innerHTML="192.168.100.171";d.getElementsByClassName("sip")[1].innerHTML="4.3.2.1";
      }
    `;
    return this.apiService.httpGet(
      ApiFilePath.WIFI_SETTINGS_JS_PATH,
      offlineDefault,
      { responseType: 'text' },
    );
  }

  /** Reads security settings from the server. */
  getSecuritySettings = () => {
    const offlineDefault = `
      function GetV(){
        var d=document;
        d.Sf.PIN.value="";d.Sf.NO.checked=0;d.Sf.OW.checked=0;d.Sf.AO.checked=1;
        d.getElementsByClassName("sip")[0].innerHTML="WLED 0.14.0-b1 (build 2212222)";sd="WLED";
      }
    `;
    return this.apiService.httpGet(
      ApiFilePath.SECURITY_SETTINGS_JS_PATH,
      offlineDefault,
      { responseType: 'text' },
    );
  }

  /** Reads time settings from the server. */
  getTimeSettings = () => {
    const offlineDefault = `
      function GetV(){
        var d=document;
        d.Sf.NT.checked=0;d.Sf.NS.value="0.wled.pool.ntp.org";d.Sf.CF.checked=1;d.Sf.TZ.selectedIndex=0;d.Sf.UO.value=0;d.Sf.LN.value="0.00";d.Sf.LT.value="0.00";d.getElementsByClassName("times")[0].innerHTML="2023-6-4, 07:57:32";d.Sf.OL.checked=0;d.Sf.O1.value=0;d.Sf.O2.value=29;d.Sf.OM.value=0;d.Sf.OS.checked=0;d.Sf.O5.checked=0;d.Sf.CE.checked=0;d.Sf.CY.value=20;d.Sf.CI.value=1;d.Sf.CD.value=1;d.Sf.CH.value=0;d.Sf.CM.value=0;d.Sf.CS.value=0;d.Sf.A0.value=0;d.Sf.A1.value=0;d.Sf.MC.value=0;d.Sf.MN.value=0;addRow(0,0,0,0);addRow(1,0,0,0);addRow(2,0,0,0);addRow(3,0,0,0);d.Sf.H0.value=0;d.Sf.N0.value=0;d.Sf.T0.value=0;d.Sf.W0.value=255;d.Sf.M0.value=1;d.Sf.P0.value=12;d.Sf.D0.value=1;d.Sf.E0.value=31;d.Sf.H1.value=0;d.Sf.N1.value=0;d.Sf.T1.value=0;d.Sf.W1.value=255;d.Sf.M1.value=1;d.Sf.P1.value=12;d.Sf.D1.value=1;d.Sf.E1.value=31;d.Sf.H2.value=0;d.Sf.N2.value=0;d.Sf.T2.value=0;d.Sf.W2.value=255;d.Sf.M2.value=1;d.Sf.P2.value=12;d.Sf.D2.value=1;d.Sf.E2.value=31;d.Sf.H3.value=0;d.Sf.N3.value=0;d.Sf.T3.value=0;d.Sf.W3.value=255;d.Sf.M3.value=1;d.Sf.P3.value=12;d.Sf.D3.value=1;d.Sf.E3.value=31;d.Sf.H4.value=0;d.Sf.N4.value=0;d.Sf.T4.value=0;d.Sf.W4.value=255;d.Sf.M4.value=1;d.Sf.P4.value=12;d.Sf.D4.value=1;d.Sf.E4.value=31;d.Sf.H5.value=0;d.Sf.N5.value=0;d.Sf.T5.value=0;d.Sf.W5.value=255;d.Sf.M5.value=1;d.Sf.P5.value=12;d.Sf.D5.value=1;d.Sf.E5.value=31;d.Sf.H6.value=0;d.Sf.N6.value=0;d.Sf.T6.value=0;d.Sf.W6.value=255;d.Sf.M6.value=1;d.Sf.P6.value=12;d.Sf.D6.value=1;d.Sf.E6.value=31;d.Sf.H7.value=0;d.Sf.N7.value=0;d.Sf.T7.value=0;d.Sf.W7.value=255;d.Sf.M7.value=1;d.Sf.P7.value=12;d.Sf.D7.value=1;d.Sf.E7.value=31;d.Sf.N8.value=0;d.Sf.T8.value=0;d.Sf.W8.value=255;d.Sf.N9.value=0;d.Sf.T9.value=0;d.Sf.W9.value=255;
      }
    `;
    return this.apiService.httpGet(
      ApiFilePath.TIME_SETTINGS_JS_PATH,
      offlineDefault,
      { responseType: 'text' },
    );
  }
}
