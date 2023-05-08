import { ParseConfiguration } from './api-response-parser.service';


// 1: WIFI SETTINGS

/*
function GetV(){
  var d=document;
  d.Sf.CS.value="wifi network";
  d.Sf.CP.value="********";
  d.Sf.I0.value=0;
  d.Sf.G0.value=0;
  d.Sf.S0.value=255;
  d.Sf.I1.value=0;
  d.Sf.G1.value=0;
  d.Sf.S1.value=255;
  d.Sf.I2.value=0;
  d.Sf.G2.value=0;
  d.Sf.S2.value=255;
  d.Sf.I3.value=0;
  d.Sf.G3.value=0;
  d.Sf.S3.value=0;
  d.Sf.CM.value="wled-9518b4";
  d.Sf.AB.selectedIndex=0;
  d.Sf.AS.value="WLED-AP";
  d.Sf.AH.checked=0;
  d.Sf.AP.value="********";
  d.Sf.AC.value=1;
  d.Sf.WS.checked=1;
  document.getElementById('ethd').style.display='none';
  d.getElementsByClassName("sip")[0].innerHTML="192.168.100.171";
  d.getElementsByClassName("sip")[1].innerHTML="4.3.2.1";
}
*/
export const WIFI_PARSE_CONFIGURATIONS: ParseConfiguration[] = [
  {
    pattern: /d.Sf.CS.value=([^;]*);/,
    name: 'CS',
    isMetadata: false,
  },
  {
    pattern: /d.Sf.CP.value=([^;]*);/,
    name: 'CP',
    isMetadata: false,
  },
  {
    pattern: /d.Sf.I0.value=([^;]*);/,
    name: 'I0',
    isMetadata: false,
  },
  {
    pattern: /d.Sf.G0.value=([^;]*);/,
    name: 'G0',
    isMetadata: false,
  },
  {
    pattern: /d.Sf.S0.value=([^;]*);/,
    name: 'S0',
    isMetadata: false,
  },
  {
    pattern: /d.Sf.I1.value=([^;]*);/,
    name: 'I1',
    isMetadata: false,
  },
  {
    pattern: /d.Sf.G1.value=([^;]*);/,
    name: 'G1',
    isMetadata: false,
  },
  {
    pattern: /d.Sf.S1.value=([^;]*);/,
    name: 'S1',
    isMetadata: false,
  },
  {
    pattern: /d.Sf.I2.value=([^;]*);/,
    name: 'I2',
    isMetadata: false,
  },
  {
    pattern: /d.Sf.G2.value=([^;]*);/,
    name: 'G2',
    isMetadata: false,
  },
  {
    pattern: /d.Sf.S2.value=([^;]*);/,
    name: 'S2',
    isMetadata: false,
  },
  {
    pattern: /d.Sf.I3.value=([^;]*);/,
    name: 'I3',
    isMetadata: false,
  },
  {
    pattern: /d.Sf.G3.value=([^;]*);/,
    name: 'G3',
    isMetadata: false,
  },
  {
    pattern: /d.Sf.S3.value=([^;]*);/,
    name: 'S3',
    isMetadata: false,
  },
  {
    pattern: /d.Sf.CM.value=([^;]*);/,
    name: 'CM',
    isMetadata: false,
  },
  {
    // TODO handle index instead of value
    pattern: /d.Sf.AB.selectedIndex=([^;]*);/,
    name: 'AB',
    isMetadata: false,
  },
  {
    pattern: /d.Sf.AS.value=([^;]*);/,
    name: 'AS',
    isMetadata: false,
  },
  {
    pattern: /d.Sf.AH.checked=([^;]*);/,
    name: 'AH',
    isMetadata: false,
  },
  {
    pattern: /d.Sf.AP.value=([^;]*);/,
    name: 'AP',
    isMetadata: false,
  },
  {
    pattern: /d.Sf.AC.value=([^;]*);/,
    name: 'AC',
    isMetadata: false,
  },
  {
    pattern: /d.Sf.WS.checked=([^;]*);/,
    name: 'WS',
    isMetadata: false,
  },
  {
    // TODO handle index instead of value
    pattern: /d.Sf.ETH.selectedIndex=([^;]*);/,
    name: 'ETH',
    isMetadata: false,
  },
  {
    pattern: /d.getElementsByClassName\("sip"\)\[0\].innerHTML=([^;]*);/,
    name: 'clientIpAddress',
    isMetadata: true,
  },
  {
    pattern: /d.getElementsByClassName\("sip"\)\[1\].innerHTML=([^;]*);/,
    name: 'wledAccessPointIpAddress',
    isMetadata: true,
  },
];


// 6: SECURITY SETTINGS

/*
function GetV(){
  var d=document;
  d.Sf.PIN.value="";
  d.Sf.NO.checked=0;
  d.Sf.OW.checked=0;
  d.Sf.AO.checked=1;
  d.getElementsByClassName("sip")[0].innerHTML="WLED 0.14.0-b1 (build 2212222)";
  sd="WLED";
}
*/
export const SECURITY_PARSE_CONFIGURATIONS: ParseConfiguration[] = [
  {
    pattern: /d.Sf.PIN.value=([^;]*);/,
    name: 'PIN', // 'settingsPin',
    isMetadata: false,
  },
  {
    pattern: /d.Sf.NO.checked=([^;]*);/,
    name: 'NO', // 'secureWirelessUpdate',
    isMetadata: false,
  },
  {
    pattern: /d.Sf.OW.checked=([^;]*);/,
    name: 'OW', // 'denyWifiSettingsAccessIfLocked',
    isMetadata: false,
  },
  {
    pattern: /d.Sf.AO.checked=([^;]*);/,
    name: 'AO', // 'enableArduinoOTA',
    isMetadata: false,
  },
  {
    pattern: /d\.getElementsByClassName\("sip"\)\[0\]\.innerHTML=([^;]*);/,
    name: 'wledVersion',
    isMetadata: true,
  },
  {
    // TODO what is this used for in original client?
    pattern: /sd=([^;]*);/,
    name: 'sd',
    isMetadata: true,
  },
];
