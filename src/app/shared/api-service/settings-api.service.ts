import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Wled2DSettings, WledDMXSettings, WledLEDSettings, WledNetworkSettings, WledSecuritySettings, WledSyncSettings, WledTimeSettings, WledUISettings, WledUpdateSettings, WledUserModSettings } from 'src/app/settings/shared/settings-types';
import { ApiFilePath, ApiPath } from './api-paths';
import { FormValues } from '../form-service';
import { MOCK_API_RESPONSE } from 'src/app/controls-wrapper/mock-api-data';
import { HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SettingsApiService {
  constructor(
    private apiService: ApiService,
  ) {
  }

  /** Settings page 1: Read network settings from the server. */
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

  /** Settings page 2: Read LED settings from the server. */
  getLEDSettings = () => {
    const offlineDefault = `
      function GetV(){
        var d=document;
        d.um_p=[-1];d.rsvd=[6,7,8,9,10,11,24,28,29,30,31,37,38];d.ro_gpio=[34,35,36,37,38,39];d.max_gpio=39;bLimits(10,0,2048,64000,8192);d.Sf.MS.checked=0;d.Sf.CCT.checked=0;d.Sf.CR.checked=0;d.Sf.CB.value=0;d.Sf.FR.value=42;d.Sf.AW.value=255;d.Sf.LD.checked=0;addLEDs(1);d.Sf.L00.value=16;d.Sf.LC0.value=856;d.Sf.LT0.value=22;d.Sf.CO0.value=1;d.Sf.LS0.value=0;d.Sf.CV0.checked=0;d.Sf.SL0.value=0;d.Sf.RF0.checked=0;d.Sf.AW0.value=0;d.Sf.WO0.value=0;d.Sf.SP0.value=2;addLEDs(1);d.Sf.L01.value=1;d.Sf.LC1.value=829;d.Sf.LT1.value=22;d.Sf.CO1.value=1;d.Sf.LS1.value=856;d.Sf.CV1.checked=1;d.Sf.SL1.value=0;d.Sf.RF1.checked=0;d.Sf.AW1.value=0;d.Sf.WO1.value=0;d.Sf.SP1.value=2;d.Sf.MA.value=850;d.Sf.LA.value=0;resetCOM(10);d.Sf.CA.value=128;d.Sf.BO.checked=1;d.Sf.BP.value=0;d.Sf.GB.checked=0;d.Sf.GC.checked=1;d.Sf.GV.value="2.8";d.Sf.TF.checked=1;d.Sf.EB.checked=1;d.Sf.TD.value=200;d.Sf.PF.checked=0;d.Sf.TP.value=5;d.Sf.BF.value=100;d.Sf.TB.value=0;d.Sf.TL.value=5;d.Sf.TW.value=1;d.Sf.PB.selectedIndex=0;d.Sf.RL.value=-1;d.Sf.RM.checked=1;addBtn(0,0,2);addBtn(1,-1,0);addBtn(2,-1,0);addBtn(3,-1,0);d.Sf.IP.checked=0;d.Sf.TT.value=32;d.Sf.IR.value=-1;d.Sf.IT.value=0;d.Sf.MSO.checked=0;
      }
    `;
    return this.apiService.httpGet(
      ApiFilePath.LED_SETTINGS_JS_PATH,
      offlineDefault,
      { responseType: 'text' },
    );
  }

  /** Settings page 3: Read UI settings from the server. */
  getUISettings = () => {
    const offlineDefault = `
      function GetV(){
        var d=document;
        d.Sf.DS.value="WLED";d.Sf.ST.checked=0;toggle('Simple');
      }
    `;
    return this.apiService.httpGet(
      ApiFilePath.UI_SETTINGS_JS_PATH,
      offlineDefault,
      { responseType: 'text' },
    );
  }

  /** Settings page 4: Read sync settings from the server. */
  getSyncSettings = () => {
    const offlineDefault = `
      function GetV(){
        var d=document;
        d.Sf.UP.value=21324;d.Sf.U2.value=65506;d.Sf.GS.value=1;d.Sf.GR.value=1;d.Sf.RB.checked=1;d.Sf.RC.checked=1;d.Sf.RX.checked=1;d.Sf.SO.checked=0;d.Sf.SG.checked=0;d.Sf.SD.checked=0;d.Sf.SB.checked=0;d.Sf.SH.checked=1;d.Sf.SM.checked=0;d.Sf.UR.value=0;d.Sf.NL.checked=1;d.Sf.NB.checked=1;d.Sf.RD.checked=1;d.Sf.MO.checked=0;d.Sf.EP.value=5568;d.Sf.ES.checked=0;d.Sf.EM.checked=0;d.Sf.EU.value=1;d.Sf.DA.value=1;d.Sf.XX.value=0;d.Sf.PY.value=0;d.Sf.DM.value=4;d.Sf.ET.value=2500;d.Sf.FB.checked=0;d.Sf.RG.checked=1;d.Sf.WO.value=0;d.Sf.AL.checked=1;d.Sf.AI.value="Strip";d.Sf.SA.checked=0;d.Sf.AP.value=0;d.Sf.MQ.checked=0;d.Sf.MS.value="";d.Sf.MQPORT.value=1883;d.Sf.MQUSER.value="";d.Sf.MQPASS.value="";d.Sf.MQCID.value="WLED-9518b4";d.Sf.MD.value="wled/9518b4";d.Sf.MG.value="wled/all";d.Sf.BM.checked=0;d.Sf.RT.checked=0;d.Sf.MD.maxlength=32;d.Sf.MG.maxlength=32;d.Sf.MS.maxlength=32;d.Sf.H0.value=192;d.Sf.H1.value=168;d.Sf.H2.value=100;d.Sf.H3.value=0;d.Sf.HL.value=1;d.Sf.HI.value=2500;d.Sf.HP.checked=0;d.Sf.HO.checked=1;d.Sf.HB.checked=1;d.Sf.HC.checked=1;d.getElementsByClassName("sip")[0].innerHTML="Inactive";d.Sf.BD.value=1152;
      }
    `;
    return this.apiService.httpGet(
      ApiFilePath.SYNC_SETTINGS_JS_PATH,
      offlineDefault,
      { responseType: 'text' },
    );
  }
  
  /** Settings page 5: Read time settings from the server. */
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

  /** Settings page 6: Read security settings from the server. */
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

  /** Settings page 7: Read DMX settings from the server. */
  getDMXSettings = () => {
    // TODO enable DMX locally then regenerate the offline default
    const offlineDefault = `
      function GetV(){
        var d=document;
      }
    `;
    return this.apiService.httpGet(
      ApiFilePath.DMX_SETTINGS_JS_PATH,
      offlineDefault,
      { responseType: 'text' },
    );
  }

  /** Settings page 8: Read usermod settings from the server. */
  getUsermodSettings = () => {
    const offlineDefault = `
      function GetV(){
        var d=document;
        d.um_p=[-1];d.rsvd=[6,7,8,9,10,11,24,28,29,30,31,37,38];d.ro_gpio=[34,35,36,37,38,39];d.max_gpio=39;numM=0;d.Sf.SDA.value=-1;d.Sf.SCL.value=-1;d.Sf.MOSI.value=-1;d.Sf.MISO.value=-1;d.Sf.SCLK.value=-1;addInfo('SDA','21');addInfo('SCL','22');addInfo('MOSI','23');addInfo('MISO','19');addInfo('SCLK','18');
      }
    `;
    return this.apiService.httpGet(
      ApiFilePath.USER_MOD_SETTINGS_JS_PATH,
      offlineDefault,
      { responseType: 'text' },
    );
  }

  /** Settings page 9: Read update settings from the server. */
  getUpdateSettings = () => {
    const offlineDefault = `
      function GetV(){
        var d=document;
        d.getElementsByClassName("sip")[0].innerHTML="WLED 0.14.1<br>(ESP32-D0WDQ5 build 2401141)";
      }
    `;
    return this.apiService.httpGet(
      ApiFilePath.UPDATE_SETTINGS_JS_PATH,
      offlineDefault,
      { responseType: 'text' },
    );
  }

  /** Settings page 10: Read 2D settings from the server. */
  get2DSettings = () => {
    const offlineDefault = `
      function GetV(){
        var d=document;
        d.Sf.SOMP.value=0;maxPanels=64;resetPanels();
      }
    `;
    return this.apiService.httpGet(
      ApiFilePath._2D_SETTINGS_JS_PATH,
      offlineDefault,
      { responseType: 'text' },
    );
  }

  /**
   * SETTERS (POST requests)
   * https://github.com/wled/WLED/blob/main/wled00/set.cpp#L16
   */

  /** Settings page 1: Set network settings on the server. */
  setNetworkSettings = (wifiSettings: Partial<WledNetworkSettings>) => {
    // TODO does this return WLEDApiResponse type or other type?
    return this.apiService.httpPost(
      ApiPath.NETWORK_SETTINGS_PATH,
      wifiSettings,
      MOCK_API_RESPONSE,
    );
  }

  // TODO use type WledLEDSettings
  /** Settings page 2: Set LED settings on the server. */
  setLedSettings = (ledSettings: FormValues) => {
    // TODO does this return WLEDApiResponse type or other type?
    return this.apiService.httpPost(
      ApiPath.LED_SETTINGS_PATH,
      ledSettings,
      MOCK_API_RESPONSE,
    );
  }

  // TODO use interface WledUISettings
  /** Settings page 3: Set UI settings on the server. */
  setUISettings = (uiSettings: FormValues) => {
    // TODO does this return WLEDApiResponse type or other type?
    return this.apiService.httpPost(
      ApiPath.UI_SETTINGS_PATH,
      uiSettings,
      MOCK_API_RESPONSE,
    );
  }

  /** Settings page 4: Set sync settings on the server. */
  setSyncSettings = (syncSetings: WledSyncSettings) => {
    // TODO does this return WLEDApiResponse type or other type?
    return this.apiService.httpPost(
      ApiPath.SYNC_SETTINGS_PATH,
      syncSetings,
      'Sync settings saved.', // TODO correct offline default
      { responseType: 'text' },
    );
  }

  /** Settings page 5: Set time settings on the server. */
  setTimeSettings = (timeSettings: WledTimeSettings) => {
    // TODO does this return WLEDApiResponse type or other type?
    return this.apiService.httpPost(
      ApiPath.TIME_SETTINGS_PATH,
      this.encodeFormData(timeSettings), // timeSettings,
      'Time settings saved.', // TODO correct offline default
      {
        responseType: 'text',
        headers: this.getDefaultPostHeaders(),
      },
    );
  }

  /** Settings page 6: Set security settings on the server. */
  setSecuritySettings = (securitySettings: WledSecuritySettings) => {
    // TODO does this return WLEDApiResponse type or other type?
    return this.apiService.httpPost(
      ApiPath.SECURITY_SETTINGS_PATH,
      securitySettings,
      'Security settings saved.',
      { responseType: 'text' },
    );
  }

  /** Settings page 7: Set DMX settings on the server. */
  setDMXSettings = (dmxSettings: WledDMXSettings) => {
    // TODO does this return WLEDApiResponse type or other type?
    return this.apiService.httpPost(
      ApiPath.DMX_SETTINGS_PATH,
      dmxSettings,
      'DMX settings saved.',
      { responseType: 'text' },
    );
  }

  /** Settings page 8: Set usermod settings on the server. */
  setUserModSettings = (userModSettings: WledUserModSettings) => {
    // TODO does this return WLEDApiResponse type or other type?
    return this.apiService.httpPost(
      ApiPath.USERMOD_SETTINGS_PATH,
      userModSettings,
      'Usermod settings saved.',
      { responseType: 'text' },
    );
  }

  // TODO - apparently this is no longer used by WLED?
  /** Settings page 9: Set update settings on the server. */
  setUpdateSettings = (updateSettings: WledUpdateSettings) => {
    // TODO does this return WLEDApiResponse type or other type?
    return this.apiService.httpPost(
      ApiPath.UPDATE_SETTINGS_PATH,
      updateSettings,
      'Update settings saved.',
      { responseType: 'text' },
    );
  }

  /** Settings page 10: Set 2D settings on the server. */
  set2DSettings = (_2DSettings: Wled2DSettings) => {
    // TODO does this return WLEDApiResponse type or other type?
    return this.apiService.httpPost(
      ApiPath._2D_SETTINGS_PATH,
      _2DSettings,
      '2D settings saved.',
      { responseType: 'text' },
    );
  }

  private encodeFormData = (
    wledFormSettings: WledNetworkSettings
      | WledLEDSettings
      | WledUISettings
      | WledSyncSettings
      | WledTimeSettings
      | WledSecuritySettings
      | WledDMXSettings
      | WledUserModSettings
      | Wled2DSettings,
  ) => {
    return Object.entries(wledFormSettings)
      .map(([k, v]) => `${k}=${v.toString()}`)
      .join('&');
  }

  // TODO - test this with other post requests besides time settings!
  private getDefaultPostHeaders = () => {
    return new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
  }
}
