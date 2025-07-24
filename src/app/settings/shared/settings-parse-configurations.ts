export enum ParseConfigurationType {
  FORM_VALUE,
  FORM_CHECKBOX,
  FORM_SELECTED_INDEX,
  METADATA,
  READ_ONLY_VALUE,
  METHOD_CALL,
}

interface BaseParseConfiguration {
  pattern: RegExp;
}

interface ParseConfigurationFormValue extends BaseParseConfiguration {
  type: ParseConfigurationType.FORM_VALUE;
}

interface ParseConfigurationFormCheckbox extends BaseParseConfiguration {
  type: ParseConfigurationType.FORM_CHECKBOX;
}

interface ParseConfigurationFormSelectedIndex extends BaseParseConfiguration {
  type: ParseConfigurationType.FORM_SELECTED_INDEX;
}

interface ParseConfigurationMetadata extends BaseParseConfiguration {
  type: ParseConfigurationType.METADATA;
  name: string;
}

interface ParseConfigurationReadOnlyValue extends BaseParseConfiguration {
  type: ParseConfigurationType.READ_ONLY_VALUE;
}

interface ParseConfigurationMethodCall extends BaseParseConfiguration {
  type: ParseConfigurationType.METHOD_CALL;
}

export type ParseConfiguration = ParseConfigurationFormValue
  | ParseConfigurationFormCheckbox
  | ParseConfigurationFormSelectedIndex
  | ParseConfigurationMetadata
  | ParseConfigurationReadOnlyValue
  | ParseConfigurationMethodCall;

const VALUE_GROUP_REGEX = '([^;]*?)';

const formValue = (name: string): ParseConfigurationFormValue => ({
  pattern: new RegExp(`d\\.Sf\\.(${name})\\.value=${VALUE_GROUP_REGEX};`),
  type: ParseConfigurationType.FORM_VALUE,
});

const formCheckbox = (name: string): ParseConfigurationFormCheckbox => ({
  pattern: new RegExp(`d\\.Sf\\.(${name})\\.checked=${VALUE_GROUP_REGEX};`),
  type: ParseConfigurationType.FORM_CHECKBOX,
});

const formSelectedIndex = (name: string): ParseConfigurationFormSelectedIndex => ({
  pattern: new RegExp(`d\\.Sf\\.(${name})\\.selectedIndex=${VALUE_GROUP_REGEX};`),
  type: ParseConfigurationType.FORM_SELECTED_INDEX,
});

const metadata = (name: string, pattern: RegExp): ParseConfigurationMetadata => ({
  pattern,
  type: ParseConfigurationType.METADATA,
  name,
});

const readOnlyValue = (pattern: RegExp): ParseConfigurationReadOnlyValue => ({
  pattern: new RegExp(`${pattern.source}=${VALUE_GROUP_REGEX};`),
  type: ParseConfigurationType.READ_ONLY_VALUE,
});

const methodCall = (name: string, paramsPrefix: string = ''): ParseConfigurationMethodCall => ({
  pattern: new RegExp(`(${name})\\((${paramsPrefix}[^;]*)\\);`),
  type: ParseConfigurationType.METHOD_CALL,
});

const forLoop = (
  startInclusive: number,
  endInclusive: number,
  increment: number,
  parseFn: (i: number) => ParseConfiguration[],
): ParseConfiguration[] => {
  const result: ParseConfiguration[] = [];
  for (let i = startInclusive; i <= endInclusive; i+= increment) {
    result.push(...parseFn(i));
  }
  return result
}


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
  formValue('CS'),
  formValue('CP'),
  formValue('I0'),
  formValue('G0'),
  formValue('S0'),
  formValue('I1'),
  formValue('G1'),
  formValue('S1'),
  formValue('I2'),
  formValue('G2'),
  formValue('S2'),
  formValue('I3'),
  formValue('G3'),
  formValue('S3'),
  formValue('CM'),
  formSelectedIndex('AB'),
  formValue('AS'),
  formCheckbox('AH'),
  formValue('AP'),
  formValue('AC'),
  formCheckbox('WS'),
  // only included if WLED is connected to Ethernet
  formSelectedIndex('ETH'),
  metadata(
    'clientIpAddress',
    /d\.getElementsByClassName\("sip"\)\[0\]\.innerHTML=([^;]*?);/,
  ),
  metadata(
    'wledAccessPointIpAddress',
    /d\.getElementsByClassName\("sip"\)\[1\]\.innerHTML=([^;]*?);/,
  ),
];


// 2: LED SETTINGS
/*
function GetV(){
  var d=document;
  d.um_p=[-1];
  d.rsvd=[6,7,8,9,10,11,24,28,29,30,31,37,38];
  d.ro_gpio=[34,35,36,37,38,39];
  d.max_gpio=39;
  bLimits(10,0,2048,64000,8192);
  d.Sf.MS.checked=0;
  d.Sf.CCT.checked=0;
  d.Sf.CR.checked=0;
  d.Sf.CB.value=0;
  d.Sf.FR.value=42;
  d.Sf.AW.value=255;
  d.Sf.LD.checked=0;
  addLEDs(1);
  d.Sf.L00.value=16;
  d.Sf.LC0.value=856;
  d.Sf.LT0.value=22;
  d.Sf.CO0.value=1;
  d.Sf.LS0.value=0;
  d.Sf.CV0.checked=0;
  d.Sf.SL0.value=0;
  d.Sf.RF0.checked=0;
  d.Sf.AW0.value=0;
  d.Sf.WO0.value=0;
  d.Sf.SP0.value=2;
  addLEDs(1);
  d.Sf.L01.value=1;
  d.Sf.LC1.value=829;
  d.Sf.LT1.value=22;
  d.Sf.CO1.value=1;
  d.Sf.LS1.value=856;
  d.Sf.CV1.checked=1;
  d.Sf.SL1.value=0;
  d.Sf.RF1.checked=0;
  d.Sf.AW1.value=0;
  d.Sf.WO1.value=0;
  d.Sf.SP1.value=2;
  d.Sf.MA.value=850;
  d.Sf.LA.value=0;
  resetCOM(10);
  d.Sf.CA.value=128;
  d.Sf.BO.checked=1;
  d.Sf.BP.value=0;
  d.Sf.GB.checked=0;
  d.Sf.GC.checked=1;
  d.Sf.GV.value="2.8";
  d.Sf.TF.checked=1;
  d.Sf.EB.checked=1;
  d.Sf.TD.value=200;
  d.Sf.PF.checked=0;
  d.Sf.TP.value=5;
  d.Sf.BF.value=100;
  d.Sf.TB.value=0;
  d.Sf.TL.value=5;
  d.Sf.TW.value=1;
  d.Sf.PB.selectedIndex=0;
  d.Sf.RL.value=-1;
  d.Sf.RM.checked=1;
  addBtn(0,0,2);
  addBtn(1,-1,0);
  addBtn(2,-1,0);
  addBtn(3,-1,0);
  d.Sf.IP.checked=0;
  d.Sf.TT.value=32;
  d.Sf.IR.value=-1;
  d.Sf.IT.value=0;
  d.Sf.MSO.checked=0;
}
*/
export const LED_PARSE_CONFIGURATIONS: ParseConfiguration[] = [
  readOnlyValue(/d.(um_p)/),
  readOnlyValue(/d.(rsvd)/),
  readOnlyValue(/d.(ro_gpio)/),
  readOnlyValue(/d.(max_gpio)/),
  methodCall('bLimits'),
  formCheckbox('MS'),
  formCheckbox('CCT'),
  formCheckbox('CR'),
  formValue('CB'),
  formValue('FR'),
  formValue('AW'),
  formCheckbox('LD'),

  ...forLoop(0, 9, 1, (i) => ([
    formValue(`L0${i}`),
    formValue(`LC${i}`),
    formValue(`LT${i}`),
    formValue(`CO${i}`),
    formValue(`LS${i}`),
    formCheckbox(`CV${i}`),
    formValue(`SL${i}`),
    formCheckbox(`RF${i}`),
    formValue(`AW${i}`),
    formValue(`WO${i}`),
    formValue(`SP${i}`),
  ])),

  formValue('MA'),
  formValue('LA'),
  methodCall('resetCOM'),
  formValue('CA'),
  formCheckbox('BO'),
  formValue('BP'),
  formCheckbox('GB'),
  formCheckbox('GC'),
  formValue('GV'),
  formCheckbox('TF'),
  formCheckbox('EB'),
  formValue('TD'),
  formCheckbox('PF'),
  formValue('TP'),
  formValue('BF'),
  formValue('TB'),
  formValue('TL'),
  formValue('TW'),
  formSelectedIndex('PB'),
  formValue('RL'),
  formCheckbox('RM'),
  // TODO figure out how many of these calls are needed dynamically
  methodCall('addBtn', '0'),
  methodCall('addBtn', '1'),
  methodCall('addBtn', '2'),
  methodCall('addBtn', '3'),
  formCheckbox('IP'),
  formValue('TT'),
  formValue('IR'),
  formValue('IT'),
  formCheckbox('MSO'),
];


// 3: UI SETTINGS
/*
function GetV(){
  var d=document;
  d.Sf.DS.value="WLED";
  d.Sf.ST.checked=0;
  toggle('Simple');
}
*/
export const UI_PARSE_CONFIGURATIONS: ParseConfiguration[] = [
  formValue('DS'),
  formCheckbox('ST'),
  // only included if Simplified UI is enabled
  formCheckbox('SU'),
  // hide Simplified UI settings
  methodCall('toggle'),
];


// 4: SYNC SETTINGS
/*
function GetV(){
  var d=document;
  d.Sf.UP.value=21324;
  d.Sf.U2.value=65506;
  d.Sf.GS.value=1;
  d.Sf.GR.value=1;
  d.Sf.RB.checked=1;
  d.Sf.RC.checked=1;
  d.Sf.RX.checked=1;
  d.Sf.SO.checked=0;
  d.Sf.SG.checked=0;
  d.Sf.SD.checked=0;
  d.Sf.SB.checked=0;
  d.Sf.SH.checked=1;
  d.Sf.SM.checked=0;
  d.Sf.UR.value=0;
  d.Sf.NL.checked=1;
  d.Sf.NB.checked=1;
  d.Sf.RD.checked=1;
  d.Sf.MO.checked=0;
  d.Sf.EP.value=5568;
  d.Sf.ES.checked=0;
  d.Sf.EM.checked=0;
  d.Sf.EU.value=1;
  d.Sf.DA.value=1;
  d.Sf.XX.value=0;
  d.Sf.PY.value=0;
  d.Sf.DM.value=4;
  d.Sf.ET.value=2500;
  d.Sf.FB.checked=0;
  d.Sf.RG.checked=1;
  d.Sf.WO.value=0;
  d.Sf.AL.checked=1;
  d.Sf.AI.value="Strip";
  d.Sf.SA.checked=0;
  d.Sf.AP.value=0;
  d.Sf.MQ.checked=0;
  d.Sf.MS.value="";
  d.Sf.MQPORT.value=1883;
  d.Sf.MQUSER.value="";
  d.Sf.MQPASS.value="";
  d.Sf.MQCID.value="WLED-9518b4";
  d.Sf.MD.value="wled/9518b4";
  d.Sf.MG.value="wled/all";
  d.Sf.BM.checked=0;
  d.Sf.RT.checked=0;
  d.Sf.MD.maxlength=32;
  d.Sf.MG.maxlength=32;
  d.Sf.MS.maxlength=32;
  d.Sf.H0.value=192;
  d.Sf.H1.value=168;
  d.Sf.H2.value=100;
  d.Sf.H3.value=0;
  d.Sf.HL.value=1;
  d.Sf.HI.value=2500;
  d.Sf.HP.checked=0;
  d.Sf.HO.checked=1;
  d.Sf.HB.checked=1;
  d.Sf.HC.checked=1;
  d.getElementsByClassName("sip")[0].innerHTML="Inactive";
  d.Sf.BD.value=1152;
}
*/
export const SYNC_PARSE_CONFIGURATIONS: ParseConfiguration[] = [
  formValue('UP'),
  formValue('U2'),
  formValue('GS'),
  formValue('GR'),
  formCheckbox('RB'),
  formCheckbox('RC'),
  formCheckbox('RX'),
  formCheckbox('SO'),
  formCheckbox('SG'),
  formCheckbox('SD'),
  formCheckbox('SB'),
  formCheckbox('SH'),
  formCheckbox('SM'),
  formValue('UR'),
  formCheckbox('NL'),
  formCheckbox('NB'),
  formCheckbox('RD'),
  formCheckbox('MO'),
  formValue('EP'),
  formCheckbox('ES'),
  formCheckbox('EM'),
  formValue('EU'),
  formValue('DA'),
  formValue('XX'),
  formValue('PY'),
  formValue('DM'),
  formValue('ET'),
  formCheckbox('FB'),
  formCheckbox('RG'),
  formValue('WO'),
  formCheckbox('AL'),
  formValue('AI'),
  formCheckbox('SA'),
  formValue('AP'),

  // only included if MQTT is enabled
  formCheckbox('MQ'),
  formValue('MS'),
  formValue('MQPORT'),
  formValue('MQUSER'),
  formValue('MQPASS'),
  formValue('MQCID'),
  formValue('MD'),
  formValue('MG'),
  formCheckbox('BM'),
  formCheckbox('RT'),
  // TODO - add support for max length
  // formValue(/d.Sf.(MD).maxlength=([^;]*?);/),
  // TODO - add support for max length
  // formValue(/d.Sf.(MG).maxlength=([^;]*?);/),
  // TODO - add support for max length
  // formValue(/d.Sf.(MS).maxlength=([^;]*?);/),
  //////////////////////////////////

  // only included if hue sync is enabled
  formValue('H0'),
  formValue('H1'),
  formValue('H2'),
  formValue('H3'),
  formValue('HL'),
  formValue('HI'),
  formCheckbox('HP'),
  formCheckbox('HO'),
  formCheckbox('HB'),
  formCheckbox('HC'),
  //////////////////////////////////

  metadata(
    'hueError',
    /d\.getElementsByClassName\("sip"\)\[0\]\.innerHTML=([^;]*?);/,
  ),
  // only included if Hue is disabled
  formValue('BD'),
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
  formCheckbox('NT'),
  formValue('NS'),
  formCheckbox('CF'),
  formSelectedIndex('TZ'),
  formValue('UO'),
  formValue('LN'),
  formValue('LT'),
  metadata(
    'pageLoadLocalTime',
    /d\.getElementsByClassName\("times"\)\[0\]\.innerHTML=([^;]*?);/,
  ),
  formCheckbox('OL'),
  formValue('O1'),
  formValue('O2'),
  formValue('OM'),
  formCheckbox('OS'),
  formCheckbox('O5'),
  formCheckbox('CE'),
  formValue('CY'),
  formValue('CI'),
  formValue('CD'),
  formValue('CH'),
  formValue('CM'),
  formValue('CS'),
  formValue('A0'),
  formValue('A1'),
  formValue('MC'),
  formValue('MN'),
  // TODO figure out how many of these calls are needed dynamically
  methodCall('addRow', '0'),
  methodCall('addRow', '1'),
  methodCall('addRow', '2'),
  methodCall('addRow', '3'),
  formValue('H0'),
  formValue('N0'),
  formValue('T0'),
  formValue('W0'),
  formValue('M0'),
  formValue('P0'),
  formValue('D0'),
  formValue('E0'),
  formValue('H1'),
  formValue('N1'),
  formValue('T1'),
  formValue('W1'),
  formValue('M1'),
  formValue('P1'),
  formValue('D1'),
  formValue('E1'),
  formValue('H2'),
  formValue('N2'),
  formValue('T2'),
  formValue('W2'),
  formValue('M2'),
  formValue('P2'),
  formValue('D2'),
  formValue('E2'),
  formValue('H3'),
  formValue('N3'),
  formValue('T3'),
  formValue('W3'),
  formValue('M3'),
  formValue('P3'),
  formValue('D3'),
  formValue('E3'),
  formValue('H4'),
  formValue('N4'),
  formValue('T4'),
  formValue('W4'),
  formValue('M4'),
  formValue('P4'),
  formValue('D4'),
  formValue('E4'),
  formValue('H5'),
  formValue('N5'),
  formValue('T5'),
  formValue('W5'),
  formValue('M5'),
  formValue('P5'),
  formValue('D5'),
  formValue('E5'),
  formValue('H6'),
  formValue('N6'),
  formValue('T6'),
  formValue('W6'),
  formValue('M6'),
  formValue('P6'),
  formValue('D6'),
  formValue('E6'),
  formValue('H7'),
  formValue('N7'),
  formValue('T7'),
  formValue('W7'),
  formValue('M7'),
  formValue('P7'),
  formValue('D7'),
  formValue('E7'),
  formValue('N8'),
  formValue('T8'),
  formValue('W8'),
  formValue('N9'),
  formValue('T9'),
  formValue('W9'),
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
  formValue('PIN'),
  formCheckbox('NO'),
  formCheckbox('OW'),
  formCheckbox('AO'),
  metadata(
    'wledVersion',
    /d\.getElementsByClassName\("sip"\)\[0\]\.innerHTML=([^;]*?);/,
  ),
  // server description
  readOnlyValue(/(sd)/),
];


// 7: DMX SETTINGS
/*
function GetV(){
  var d=document;
  TODO - get sample values for these
}
*/
export const DMX_PARSE_CONFIGURATIONS: ParseConfiguration[] = [
  // all fields only included if DMX is enabled
  formValue('PU'),
  formValue('CN'),
  formValue('CG'),
  formValue('CS'),
  formValue('SL'),
  formSelectedIndex('CH1'),
  formSelectedIndex('CH2'),
  formSelectedIndex('CH3'),
  formSelectedIndex('CH4'),
  formSelectedIndex('CH5'),
  formSelectedIndex('CH6'),
  formSelectedIndex('CH7'),
  formSelectedIndex('CH8'),
  formSelectedIndex('CH9'),
  formSelectedIndex('CH10'),
  formSelectedIndex('CH11'),
  formSelectedIndex('CH12'),
  formSelectedIndex('CH13'),
  formSelectedIndex('CH14'),
  formSelectedIndex('CH15'),
];


// 8: USERMOD SETTINGS
/*
function GetV(){
  var d=document;
  d.um_p=[-1];
  d.rsvd=[6,7,8,9,10,11,24,28,29,30,31,37,38];
  d.ro_gpio=[34,35,36,37,38,39];
  d.max_gpio=39;
  numM=0;
  d.Sf.SDA.value=-1;
  d.Sf.SCL.value=-1;
  d.Sf.MOSI.value=-1;
  d.Sf.MISO.value=-1;
  d.Sf.SCLK.value=-1;
  addInfo('SDA','21');
  addInfo('SCL','22');
  addInfo('MOSI','23');
  addInfo('MISO','19');
  addInfo('SCLK','18');
}
*/
export const USER_MOD_PARSE_CONFIGURATIONS: ParseConfiguration[] = [
  readOnlyValue(/d.(um_p)/),
  readOnlyValue(/d.(rsvd)/),
  readOnlyValue(/d.(ro_gpio)/),
  readOnlyValue(/d.(max_gpio)/),
  // number of user mods
  readOnlyValue(/(numM)/),
  formValue('SDA'),
  formValue('SCL'),
  formValue('MOSI'),
  formValue('MISO'),
  formValue('SCLK'),
  methodCall('addInfo', '\'SDA'),
  methodCall('addInfo', '\'SCL'),
  methodCall('addInfo', '\'MOSI'),
  methodCall('addInfo', '\'MISO'),
  methodCall('addInfo', '\'SCLK'),
  // TODO how to handle the user mod configs
];


// 9: UPDATE SETTINGS
/*
function GetV(){
  var d=document;
  d.getElementsByClassName("sip")[0].innerHTML="WLED 0.14.1<br>(ESP32-D0WDQ5 build 2401141)";
}
*/
export const UPDATE_PARSE_CONFIGURATIONS: ParseConfiguration[] = [
  metadata(
    'wledVersion',
    /d\.getElementsByClassName\("sip"\)\[0\]\.innerHTML=([^;]*?);/,
  ),
];


// 10: 2D SETTINGS
/*
function GetV(){
  var d=document;
  d.Sf.SOMP.value=0;
  maxPanels=64;
  resetPanels();
}
*/
export const _2D_PARSE_CONFIGURATIONS: ParseConfiguration[] = [
  formValue('SOMP'),
  readOnlyValue(/(maxPanels)/),

  ...forLoop(0, 63, 1, (i) => ([
    formValue(`P${i}B`),
    formValue(`P${i}R`),
    formValue(`P${i}V`),
    formValue(`P${i}S`),
    formValue(`P${i}X`),
    formValue(`P${i}Y`),
    formValue(`P${i}W`),
    formValue(`P${i}H`),
  ])),
];
