interface ParseConfigurationMetadata {
  pattern: RegExp;
  isMetadata: true;
  name: string;
}

interface ParseConfigurationFormValue {
  pattern: RegExp;
  isMetadata: false;
}

export type ParseConfiguration = ParseConfigurationMetadata | ParseConfigurationFormValue;

const metadata = (name: string, pattern: RegExp): ParseConfigurationMetadata => ({
  pattern,
  isMetadata: true,
  name,
});

const formValue = (pattern: RegExp): ParseConfigurationFormValue => ({
  pattern,
  isMetadata: false,
});


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
  formValue(/d.Sf.(CS).value=([^;]*);/),
  formValue(/d.Sf.(CP).value=([^;]*);/),
  formValue(/d.Sf.(I0).value=([^;]*);/),
  formValue(/d.Sf.(G0).value=([^;]*);/),
  formValue(/d.Sf.(S0).value=([^;]*);/),
  formValue(/d.Sf.(I1).value=([^;]*);/),
  formValue(/d.Sf.(G1).value=([^;]*);/),
  formValue(/d.Sf.(S1).value=([^;]*);/),
  formValue(/d.Sf.(I2).value=([^;]*);/),
  formValue(/d.Sf.(G2).value=([^;]*);/),
  formValue(/d.Sf.(S2).value=([^;]*);/),
  formValue(/d.Sf.(I3).value=([^;]*);/),
  formValue(/d.Sf.(G3).value=([^;]*);/),
  formValue(/d.Sf.(S3).value=([^;]*);/),
  formValue(/d.Sf.(CM).value=([^;]*);/),
  // TODO handle index instead of value
  formValue(/d.Sf.(AB).selectedIndex=([^;]*);/),
  formValue(/d.Sf.(AS).value=([^;]*);/),
  formValue(/d.Sf.(AH).checked=([^;]*);/),
  formValue(/d.Sf.(AP).value=([^;]*);/),
  formValue(/d.Sf.(AC).value=([^;]*);/),
  formValue(/d.Sf.(WS).checked=([^;]*);/),
  // TODO handle index instead of value
  formValue(/d.Sf.(ETH).selectedIndex=([^;]*);/),
  metadata(
    'clientIpAddress',
    /d.getElementsByClassName\("sip"\)\[0\].innerHTML=([^;]*);/,
  ),
  metadata(
    'wledAccessPointIpAddress',
    /d.getElementsByClassName\("sip"\)\[1\].innerHTML=([^;]*);/,
  ),
];


// 5: TIME SETTINGS

/*
function GetV(){
  var d=document;
  d.Sf.NT.checked=0;
  d.Sf.NS.value="0.wled.pool.ntp.org";
  d.Sf.CF.checked=1;
  d.Sf.TZ.selectedIndex=0;
  d.Sf.UO.value=0;
  d.Sf.LN.value="0.00";
  d.Sf.LT.value="0.00";
  d.getElementsByClassName("times")[0].innerHTML="2023-6-4, 07:57:32";
  d.Sf.OL.checked=0;
  d.Sf.O1.value=0;
  d.Sf.O2.value=29;
  d.Sf.OM.value=0;
  d.Sf.OS.checked=0;
  d.Sf.O5.checked=0;
  d.Sf.CE.checked=0;
  d.Sf.CY.value=20;
  d.Sf.CI.value=1;
  d.Sf.CD.value=1;
  d.Sf.CH.value=0;
  d.Sf.CM.value=0;
  d.Sf.CS.value=0;
  d.Sf.A0.value=0;
  d.Sf.A1.value=0;
  d.Sf.MC.value=0;
  d.Sf.MN.value=0;
  addRow(0,0,0,0);
  addRow(1,0,0,0);
  addRow(2,0,0,0);
  addRow(3,0,0,0);
  d.Sf.H0.value=0;
  d.Sf.N0.value=0;
  d.Sf.T0.value=0;
  d.Sf.W0.value=255;
  d.Sf.M0.value=1;
  d.Sf.P0.value=12;
  d.Sf.D0.value=1;
  d.Sf.E0.value=31;
  d.Sf.H1.value=0;
  d.Sf.N1.value=0;
  d.Sf.T1.value=0;
  d.Sf.W1.value=255;
  d.Sf.M1.value=1;
  d.Sf.P1.value=12;
  d.Sf.D1.value=1;
  d.Sf.E1.value=31;
  d.Sf.H2.value=0;
  d.Sf.N2.value=0;
  d.Sf.T2.value=0;
  d.Sf.W2.value=255;
  d.Sf.M2.value=1;
  d.Sf.P2.value=12;
  d.Sf.D2.value=1;
  d.Sf.E2.value=31;
  d.Sf.H3.value=0;
  d.Sf.N3.value=0;
  d.Sf.T3.value=0;
  d.Sf.W3.value=255;
  d.Sf.M3.value=1;
  d.Sf.P3.value=12;
  d.Sf.D3.value=1;
  d.Sf.E3.value=31;
  d.Sf.H4.value=0;
  d.Sf.N4.value=0;
  d.Sf.T4.value=0;
  d.Sf.W4.value=255;
  d.Sf.M4.value=1;
  d.Sf.P4.value=12;
  d.Sf.D4.value=1;
  d.Sf.E4.value=31;
  d.Sf.H5.value=0;
  d.Sf.N5.value=0;
  d.Sf.T5.value=0;
  d.Sf.W5.value=255;
  d.Sf.M5.value=1;
  d.Sf.P5.value=12;
  d.Sf.D5.value=1;
  d.Sf.E5.value=31;
  d.Sf.H6.value=0;
  d.Sf.N6.value=0;
  d.Sf.T6.value=0;
  d.Sf.W6.value=255;
  d.Sf.M6.value=1;
  d.Sf.P6.value=12;
  d.Sf.D6.value=1;
  d.Sf.E6.value=31;
  d.Sf.H7.value=0;
  d.Sf.N7.value=0;
  d.Sf.T7.value=0;
  d.Sf.W7.value=255;
  d.Sf.M7.value=1;
  d.Sf.P7.value=12;
  d.Sf.D7.value=1;
  d.Sf.E7.value=31;
  d.Sf.N8.value=0;
  d.Sf.T8.value=0;
  d.Sf.W8.value=255;
  d.Sf.N9.value=0;
  d.Sf.T9.value=0;
  d.Sf.W9.value=255;
}
*/
export const TIME_PARSE_CONFIGURATIONS: ParseConfiguration[] = [
  formValue(/d.Sf.(NT).checked=([^;]*);/),
  formValue(/d.Sf.(NS).value=([^;]*);/),
  formValue(/d.Sf.(CF).checked=([^;]*);/),
  // TODO handle index instead of value
  formValue(/d.Sf.(TZ).selectedIndex=([^;]*);/),
  formValue(/d.Sf.(UO).value=([^;]*);/),
  formValue(/d.Sf.(LN).value=([^;]*);/),
  formValue(/d.Sf.(LT).value=([^;]*);/),
  metadata(
    'pageLoadLocalTime',
    /d.getElementsByClassName("times")[0].innerHTML=([^;]*);/,
  ),
  formValue(/d.Sf.(OL).checked=([^;]*);/),
  formValue(/d.Sf.(O1).value=([^;]*);/),
  formValue(/d.Sf.(O2).value=([^;]*);/),
  formValue(/d.Sf.(OM).value=([^;]*);/),
  formValue(/d.Sf.(OS).checked=([^;]*);/),
  formValue(/d.Sf.(O5).checked=([^;]*);/),
  formValue(/d.Sf.(CE).checked=([^;]*);/),
  formValue(/d.Sf.(CY).value=([^;]*);/),
  formValue(/d.Sf.(CI).value=([^;]*);/),
  formValue(/d.Sf.(CD).value=([^;]*);/),
  formValue(/d.Sf.(CH).value=([^;]*);/),
  formValue(/d.Sf.(CM).value=([^;]*);/),
  formValue(/d.Sf.(CS).value=([^;]*);/),
  formValue(/d.Sf.(A0).value=([^;]*);/),
  formValue(/d.Sf.(A1).value=([^;]*);/),
  formValue(/d.Sf.(MC).value=([^;]*);/),
  formValue(/d.Sf.(MN).value=([^;]*);/),
  formValue(/d.Sf.(H0).value=([^;]*);/),
  formValue(/d.Sf.(N0).value=([^;]*);/),
  formValue(/d.Sf.(T0).value=([^;]*);/),
  formValue(/d.Sf.(W0).value=([^;]*);/),
  formValue(/d.Sf.(M0).value=([^;]*);/),
  formValue(/d.Sf.(P0).value=([^;]*);/),
  formValue(/d.Sf.(D0).value=([^;]*);/),
  formValue(/d.Sf.(E0).value=([^;]*);/),
  formValue(/d.Sf.(H1).value=([^;]*);/),
  formValue(/d.Sf.(N1).value=([^;]*);/),
  formValue(/d.Sf.(T1).value=([^;]*);/),
  formValue(/d.Sf.(W1).value=([^;]*);/),
  formValue(/d.Sf.(M1).value=([^;]*);/),
  formValue(/d.Sf.(P1).value=([^;]*);/),
  formValue(/d.Sf.(D1).value=([^;]*);/),
  formValue(/d.Sf.(E1).value=([^;]*);/),
  formValue(/d.Sf.(H2).value=([^;]*);/),
  formValue(/d.Sf.(N2).value=([^;]*);/),
  formValue(/d.Sf.(T2).value=([^;]*);/),
  formValue(/d.Sf.(W2).value=([^;]*);/),
  formValue(/d.Sf.(M2).value=([^;]*);/),
  formValue(/d.Sf.(P2).value=([^;]*);/),
  formValue(/d.Sf.(D2).value=([^;]*);/),
  formValue(/d.Sf.(E2).value=([^;]*);/),
  formValue(/d.Sf.(H3).value=([^;]*);/),
  formValue(/d.Sf.(N3).value=([^;]*);/),
  formValue(/d.Sf.(T3).value=([^;]*);/),
  formValue(/d.Sf.(W3).value=([^;]*);/),
  formValue(/d.Sf.(M3).value=([^;]*);/),
  formValue(/d.Sf.(P3).value=([^;]*);/),
  formValue(/d.Sf.(D3).value=([^;]*);/),
  formValue(/d.Sf.(E3).value=([^;]*);/),
  formValue(/d.Sf.(H4).value=([^;]*);/),
  formValue(/d.Sf.(N4).value=([^;]*);/),
  formValue(/d.Sf.(T4).value=([^;]*);/),
  formValue(/d.Sf.(W4).value=([^;]*);/),
  formValue(/d.Sf.(M4).value=([^;]*);/),
  formValue(/d.Sf.(P4).value=([^;]*);/),
  formValue(/d.Sf.(D4).value=([^;]*);/),
  formValue(/d.Sf.(E4).value=([^;]*);/),
  formValue(/d.Sf.(H5).value=([^;]*);/),
  formValue(/d.Sf.(N5).value=([^;]*);/),
  formValue(/d.Sf.(T5).value=([^;]*);/),
  formValue(/d.Sf.(W5).value=([^;]*);/),
  formValue(/d.Sf.(M5).value=([^;]*);/),
  formValue(/d.Sf.(P5).value=([^;]*);/),
  formValue(/d.Sf.(D5).value=([^;]*);/),
  formValue(/d.Sf.(E5).value=([^;]*);/),
  formValue(/d.Sf.(H6).value=([^;]*);/),
  formValue(/d.Sf.(N6).value=([^;]*);/),
  formValue(/d.Sf.(T6).value=([^;]*);/),
  formValue(/d.Sf.(W6).value=([^;]*);/),
  formValue(/d.Sf.(M6).value=([^;]*);/),
  formValue(/d.Sf.(P6).value=([^;]*);/),
  formValue(/d.Sf.(D6).value=([^;]*);/),
  formValue(/d.Sf.(E6).value=([^;]*);/),
  formValue(/d.Sf.(H7).value=([^;]*);/),
  formValue(/d.Sf.(N7).value=([^;]*);/),
  formValue(/d.Sf.(T7).value=([^;]*);/),
  formValue(/d.Sf.(W7).value=([^;]*);/),
  formValue(/d.Sf.(M7).value=([^;]*);/),
  formValue(/d.Sf.(P7).value=([^;]*);/),
  formValue(/d.Sf.(D7).value=([^;]*);/),
  formValue(/d.Sf.(E7).value=([^;]*);/),
  formValue(/d.Sf.(N8).value=([^;]*);/),
  formValue(/d.Sf.(T8).value=([^;]*);/),
  formValue(/d.Sf.(W8).value=([^;]*);/),
  formValue(/d.Sf.(N9).value=([^;]*);/),
  formValue(/d.Sf.(T9).value=([^;]*);/),
  formValue(/d.Sf.(W9).value=([^;]*);/),
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
  formValue(/d.Sf.(PIN).value=([^;]*);/),
  formValue(/d.Sf.(NO).checked=([^;]*);/),
  formValue(/d.Sf.(OW).checked=([^;]*);/),
  formValue(/d.Sf.(AO).checked=([^;]*);/),
  metadata(
    'wledVersion',
    /d\.getElementsByClassName\("sip"\)\[0\]\.innerHTML=([^;]*);/,
  ),
  // TODO what is this used for in original client?
  metadata(
    'sd',
    /sd=([^;]*);/,
  ),
];
