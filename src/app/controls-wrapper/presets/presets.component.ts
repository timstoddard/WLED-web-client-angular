import { Component, Input, OnInit } from '@angular/core';
import { AppUIConfig } from '../../shared/ui-config.service';
import { LocalStorageKey, LocalStorageService } from '../../shared/local-storage.service';
import { generateApiUrl } from '../json.service';
import { getInput, isObject } from '../utils';

interface Playlists { [key: number]: Playlist }
interface Playlist {
  ps: number[]; // [0],
  dur: number[]; // [100],
  transition: number[]; // [-1],	// to be initiated to default transition dur
  repeat: number; // 0,
  r: boolean; // false,
  end?: number; // 0,
}

interface Obj {
  win: string; // backup stringified json
  o: boolean;
  on: boolean;
  ib: boolean;
  sb: boolean;
  psave: number;
  n: string;
  playlist: Playlist;
  ql: string;
}

@Component({
  selector: 'app-presets',
  templateUrl: './presets.component.html',
  styleUrls: ['./presets.component.scss']
})
export class PresetsComponent implements OnInit {
  @Input() useLocalStorage: boolean = true;
  @Input() cfg!: AppUIConfig; // TODO get from service/reducer
  private pJson: any = {}; /* TODO type */
  private pQL: any[] = [];
  private pNum = 0;
  private pmt = 1;
  private pmtLS = 0;
  private pmtLast = 0;
  private expanded = [false];
  private currentPreset = -1;
  private tr = 0.7;
  private pN = ''; // current playlist/preset name
  private pI = 0; // current playlist/preset id
  private plJson: Playlists = this.getDefaultPlaylist();

  constructor(private localStorageService: LocalStorageService) { }

  ngOnInit() {
    if (this.useLocalStorage) {
      const storedPresets = this.localStorageService.get(LocalStorageKey.SAVED_PRESETS);
      if (storedPresets) {
        this.pJson = storedPresets;
      }
    }
    delete this.pJson[0]; // delete default preset
    let cn = '';
    const presets = Object.entries(this.pJson);
    presets.sort(this.sortPresetsByName);
    this.pQL = [];
    const is = [];
    this.pNum = 0;
    const storedPmt = this.localStorageService.get<number>('wledPmt');
    if (storedPmt) {
      this.pmtLS = storedPmt;
    }
    this.resetPUtil();


    if (presets.length > 0) {
      for (const preset of presets) {
        if (!isObject(preset[1])) {
          continue;
        }
        const i = parseInt(preset[0]);
        const qll = (preset[1] as any).ql;
        if (qll) {
          this.pQL.push([i, qll]);
        }
        is.push(i);

        cn += `<div class="seg pres" id="p${i}o">`;
        if (this.cfg.showPresetIds) {
          cn += `<div class="pid">${i}</div>`;
        }
        cn += `<div class="segname pname" onclick="setPreset(${i})">${this.isPlaylist(i) ? "<i class='icons btn-icon'>&#xe139;</i>" : ''}${this.getPresetName(i)}</div>
          <i class="icons e-icon flr ${this.expanded[i + 100] ? "exp" : ''}" id="sege${i + 100}" onclick="expand(${i + 100})">&#xe395;</i>
          <div class="segin" id="seg${i + 100}"></div>
        </div><br>`;
        this.pNum++;
      }
    }

    // document.getElementById('pcont')!.innerHTML = cn;

    if (this.pNum > 0) {
      if (this.pmtLS !== this.pmt && this.pmt !== 0) {
        this.localStorageService.set('wledPmt', this.pmt);
        this.pJson[0] = {};
        this.localStorageService.set('wledP', this.pJson);
      }
      this.pmtLS = this.pmt;
      for (let a = 0; a < is.length; a++) {
        const i = is[a];
        if (this.expanded[i + 100]) {
          this.expand(i + 100, true);
        }
      }
      // this.makePlSel(arr);
    } else {
      this.presetError(true);
    }
    this.updatePA();
    this.populateQL();
  }

  private getDefaultPlaylist() {
    return {
      0: {
        ps: [0],
        dur: [100],
        transition: [-1],	// to be initiated to default transition dur
        repeat: 0,
        r: false,
        end: 0,
      },
    };
  }

  private loadPresets(callback?: () => void) {
    //1st boot (because there is a callback)
    if (callback && this.pmt === this.pmtLS && this.pmt > 0) {
      // we have a copy of the presets in local storage and don't need to fetch another one
      // this.populatePresets(true);
      this.pmtLast = this.pmt;
      callback();
      return;
    }

    //afterwards
    if (!callback && this.pmt === this.pmtLast) {
      return;
    }

    this.pmtLast = this.pmt;

    const url = generateApiUrl('presets.json', true);

    fetch(url, { method: 'get' })
      .then(res => {
        if (!res.ok) {
          // this.showErrorToast();
        }
        return res.json();
      })
      .then(json => {
        this.pJson = json;
        // this.populatePresets();
      })
      .catch((error) => {
        // showToast(error, true);
        console.log(error);
        this.presetError(false);
      })
      .finally(() => {
        if (callback) {
          setTimeout(callback, 99);
        }
      });
  }

  private populateQL() {
    let cn = '';
    if (this.pQL.length > 0) {
      cn += `<p class="labels">Quick load</p>`;

      let it = 0;
      // TODO better solution than `|| []`
      for (const key of (this.pQL || [])) {
        cn += `<button class="xxs btn psts" id="p${key[0]}qlb" onclick="setPreset(${key[0]});">${key[1]}</button>`;
        it++;
        if (it > 4) {
          it = 0;
          cn += '<br>';
        }
      }
      if (it !== 0) {
        cn += '<br>';
      }

      cn += `<p class="labels">All presets</p>`;
    }
    // document.getElementById('pql')!.innerHTML = cn;
  }

  private isPlaylist(i: number) {
    return this.pJson[i].playlist && this.pJson[i].playlist.ps;
  }

  private sortPresetsByName = (a: any /* TODO type */, b: any /* TODO type */) => {
    if (!a[1].n) {
      return a[0] > b[0];
    }
    return a[1].n.localeCompare(b[1].n, undefined, { numeric: true });
  }

  private presetError(isEmpty: boolean) {
    let hasBackup = false;
    let backupString = '';
    try {
      backupString = JSON.stringify(this.localStorageService.get(LocalStorageKey.SAVED_PRESETS));
      if (backupString.length > 10) {
        hasBackup = true;
      }
    } catch (e) {

    }
    let cn = `<div class="seg c">`;
    if (isEmpty)
      cn += `You have no presets yet!`;
    else
      cn += `Sorry, there was an issue loading your presets!`;

    if (hasBackup) {
      cn += `<br><br>`;
      if (isEmpty)
        cn += `However, there is backup preset data of a previous installation available.<br>
        (Saving a preset will hide this and overwrite the backup)`;
      else
        cn += `Here is a backup of the last known good state:`;
      cn += `<textarea id="bck"></textarea><br>
        <button class="btn btn-p" onclick="cpBck()">Copy to clipboard</button>`;
    }
    cn += `</div>`;
    // document.getElementById('pcont')!.innerHTML = cn;
    if (hasBackup) {
      (document.getElementById('bck')! as HTMLTextAreaElement).value = backupString;
    }
  }

  private setPreset(presetIndex: number) { // TODO is presetId better??
    const obj: any = { ps: presetIndex };
    if (this.isPlaylist(presetIndex)) {
      obj.on = true; // force on
    }
    // showToast(`Loading preset ${this.getPresetName(presetIndex)} (${presetIndex})`);
    // this.requestJson(obj);
  }

  private getPresetName(presetIndex: number) { // TODO is presetId better??
    return this.pJson[presetIndex].n
      ? this.pJson[presetIndex].n
      : `Preset ${presetIndex}`;
  }

  private expand(i: number, a: any /* TODO type & default */) {
    if (!a) {
      this.expanded[i] = !this.expanded[i];
    }
    document.getElementById('seg' + i)!.style.display = (this.expanded[i]) ? 'block' : 'none';
    document.getElementById('sege' + i)!.style.transform = (this.expanded[i]) ? 'rotate(180deg)' : 'rotate(0deg)';
    if (i < 100) {
      document.getElementById(`seg${i}nedit`)!.style.display = (this.expanded[i]) ? 'inline' : 'none';
      return; // no preset, we are done
    }

    const p = i - 100;
    document.getElementById(`p${p}o`)!.style.background =
      (this.expanded[i] || p !== this.currentPreset)
        ? 'var(--c-2)'
        : 'var(--c-6)';
    if (document.getElementById('seg' + i)!.innerHTML !== '') {
      return;
    }
    if (this.isPlaylist(p)) {
      this.plJson[p] = this.pJson[p].playlist;
      // make sure all keys are present in this.plJson[p]
      this.formatArr(this.plJson[p]);
      if (isNaN(this.plJson[p].repeat)) {
        this.plJson[p].repeat = 0;
      }
      if (!this.plJson[p].r) {
        this.plJson[p].r = false;
      }
      if (isNaN(this.plJson[p].end as number)) {
        this.plJson[p].end = 0;
      }

      document.getElementById('seg' + i)!.innerHTML = this.createPresetOrPlaylist(p, true);
      this.refreshPlE(p);
    } else {
      document.getElementById('seg' + i)!.innerHTML = this.createPresetOrPlaylist(p);
    }
    const papi = this.papiVal(p);
    (document.getElementById(`p${p}api`)! as HTMLTextAreaElement).value = papi;
    if (papi.indexOf('Please') === 0) {
      getInput(`p${p}cstgl`).checked = true;
    }
    this.tglCs(p);
  }

  //updates background color of currently selected preset
  private updatePA() {
    let ps = document.getElementsByClassName('seg'); //reset all preset buttons
    for (let i = 0; i < ps.length; i++) {
      (ps[i] as HTMLElement).style.backgroundColor = 'var(--c-2)';
    }
    ps = document.getElementsByClassName('psts'); //reset all quick selectors
    for (let i = 0; i < ps.length; i++) {
      (ps[i] as HTMLElement).style.backgroundColor = 'var(--c-2)';
    }
    if (this.currentPreset > 0) {
      let acv = document.getElementById(`p${this.currentPreset}o`);
      if (acv && !this.expanded[this.currentPreset + 100])
        acv.style.background = 'var(--c-6)'; //highlight current preset
      acv = document.getElementById(`p${this.currentPreset}qlb`);
      if (acv) {
        acv.style.background = 'var(--c-6)'; //highlight quick selector
      }
    }
  }

  private makePlUtil() {
    if (this.pNum < 2) {
      // showToast('You need at least 2 presets to make a playlist!');
      return;
    }
    if (this.plJson[0].transition[0] < 0) {
      this.plJson[0].transition[0] = this.tr;
    }
    document.getElementById('putil')!.innerHTML = `<div class="seg pres">
    <div class="segname newseg">
      New playlist</div>
    <div class="segin expanded" id="seg100">
    ${this.createPresetOrPlaylist(0, true)}</div></div>`;

    this.refreshPlE(0);
  }

  private createPresetOrPlaylist(id: number, isPlaylist = false) {
    let content = '';
    if (isPlaylist) {
      const rep = this.plJson[id].repeat
        ? this.plJson[id].repeat
        : 0;
      content = `<div class="first c">Playlist Entries</div>
  <div id="ple${id}"></div>
  <label class="check revchkl">
    Shuffle
    <input type="checkbox" id="pl${id}rtgl" onchange="plR(${id})" ${this.plJson[id].r ? 'checked' : ''}>
    <span class="checkmark schk"></span>
  </label>
  <label class="check revchkl">
    Repeat indefinitely
    <input type="checkbox" id="pl${id}rptgl" onchange="plR(${id})" ${rep ? "" : "checked"}>
    <span class="checkmark schk"></span>
  </label>
  <div id="pl${id}o1" style="display:${rep ? "block" : "none"}">
    <div class="c">Repeat <input class="noslide" type="number" id="pl${id}rp" oninput="plR(${id})" max=127 min=0 value=${rep > 0 ? rep : 1}> times</div>
    End preset:<br>
    <select class="btn sel sel-ple" id="pl${id}selEnd" onchange="plR(${id})" data-val=${this.plJson[id].end ? this.plJson[id].end : 0}>
      <option value=0>None</option>
      ${this.makePlSel(true)}
    </select>
  </div>
  <button class="btn btn-i btn-p" onclick="testPl(${id}, this)"><i class='icons btn-icon'>&#xe139;</i>Test</button>`;
    }
    else content = `<label class="check revchkl">
    Include brightness
    <input type="checkbox" id="p${id}ibtgl" checked>
    <span class="checkmark schk"></span>
  </label>
  <label class="check revchkl">
    Save segment bounds
    <input type="checkbox" id="p${id}sbtgl" checked>
    <span class="checkmark schk"></span>
  </label>`;

    return `<input type="text" class="ptxt noslide" id="p${id}txt" autocomplete="off" maxlength=32 value="${(id > 0) ? this.getPresetName(id) : ""}" placeholder="Enter name..."/><br>
  <div class="c">Quick load label: <input type="text" class="qltxt noslide" maxlength=2 value="${this.qlName(id)}" id="p${id}ql" autocomplete="off"/></div>
  <div class="h">(leave empty for no Quick load button)</div>
  <div ${isPlaylist && id === 0 ? "style='display:none'" : ""}>
    <label class="check revchkl">
      ${isPlaylist ? "Show playlist editor" : (id > 0) ? "Overwrite with state" : "Use current state"}
      <input type="checkbox" id="p${id}cstgl" onchange="tglCs(${id})" ${(id === 0 || isPlaylist) ? "checked" : ""}>
      <span class="checkmark schk"></span>
    </label><br>
  </div>
  <div class="po2" id="p${id}o2">
    API command<br>
    <textarea class="noslide" id="p${id}api"></textarea>
  </div>
  <div class="po1" id="p${id}o1">
    ${content}
  </div>
  <div class="c">Save to ID <input class="noslide" id="p${id}id" type="number" oninput="checkUsed(${id})" max=250 min=1 value=${(id > 0) ? id : this.getLowestUnusedP()}></div>
  <div class="c">
    <button class="btn btn-i btn-p" onclick="saveP(${id},${isPlaylist})"><i class="icons btn-icon">&#xe390;</i>Save ${(isPlaylist) ? 'playlist' : (id > 0) ? 'changes' : 'preset'}</button>
    ${(id > 0) ? '<button class="btn btn-i btn-p" id="p' + id + 'del" onclick="delP(' + id + ')"><i class="icons btn-icon">&#xe037;</i>Delete ' + (isPlaylist ? 'playlist' : 'preset') :
        '<button class="btn btn-p" onclick="resetPUtil()">Cancel'}</button>
  </div>
  <div class="pwarn ${(id > 0) ? 'bp' : ''} c" id="p${id}warn">

  </div>
  ${(id > 0) ? ('<div class="h">ID ' + id + '</div>') : ''}`;
  }

  private makePUtil() {
    document.getElementById('putil')!.innerHTML = `<div class="seg pres">
    <div class="segname newseg">
      New preset</div>
    <div class="segin expanded">
    ${this.createPresetOrPlaylist(0)}</div></div>`;
  }

  private refreshPlE(playlistId: number) {
    const plEDiv = document.getElementById(`ple${playlistId}`);
    if (!plEDiv) {
      return;
    }
    let content = '';
    for (let i = 0; i < this.plJson[playlistId].ps.length; i++) {
      content += this.makePlEntry(playlistId, i);
    }
    plEDiv.innerHTML = content;
    const dels = plEDiv.getElementsByClassName('btn-pl-del');
    if (dels.length < 2) {
      (dels[0] as HTMLElement).style.display = 'none';
    }

    const sels = Array.from(document.getElementById(`seg${playlistId + 100}`)!.getElementsByClassName('sel')) as HTMLSelectElement[];
    for (const i of sels) {
      if (i.dataset['val']) {
        if (parseInt(i.dataset['val']) > 0) {
          i.value = i.dataset['val'];
        } else {
          const index = parseInt(i.dataset['index']!, 10);
          this.plJson[playlistId].ps[index] = parseInt(i.value);
        }
      }
    }
  }

  private addPl(playlistId: number, psIndex: number) {
    this.plJson[playlistId].ps.splice(psIndex + 1, 0, 0);
    this.plJson[playlistId].dur.splice(psIndex + 1, 0, this.plJson[playlistId].dur[psIndex]);
    this.plJson[playlistId].transition.splice(psIndex + 1, 0, this.plJson[playlistId].transition[psIndex]);
    this.refreshPlE(playlistId);
  }

  private delPl(playlistId: number, psIndex: number) {
    if (this.plJson[playlistId].ps.length < 2) {
      return;
    }
    this.plJson[playlistId].ps.splice(psIndex, 1);
    this.plJson[playlistId].dur.splice(psIndex, 1);
    this.plJson[playlistId].transition.splice(psIndex, 1);
    this.refreshPlE(playlistId);
  }

  plePs(playlistId: number, psIndex: number, field: HTMLSelectElement) {
    this.plJson[playlistId].ps[psIndex] = parseInt(field.value);
  }

  pleDur(playlistId: number, psIndex: number, field: HTMLInputElement) {
    if (field.validity.valid) {
      const dur = Math.floor(parseInt(field.value, 10) * 10);
      this.plJson[playlistId].dur[psIndex] = dur;
    }
  }

  pleTr(playlistId: number, psIndex: number, field: HTMLInputElement) {
    if (field.validity.valid) {
      const transition = Math.floor(parseInt(field.value, 10) * 10);
      this.plJson[playlistId].transition[psIndex] = transition;
    }
  }

  private plR(playlistId: number) {
    const playlist = this.plJson[playlistId];
    playlist.r = getInput(`pl${playlistId}rtgl`).checked;
    if (getInput(`pl${playlistId}rptgl`).checked) { //infinite
      playlist.repeat = 0;
      delete playlist.end;
      document.getElementById(`pl${playlistId}o1`)!.style.display = 'none';
    } else {
      playlist.repeat = parseInt(getInput(`pl${playlistId}rp`).value);
      playlist.end = parseInt(getInput(`pl${playlistId}selEnd`).value);
      document.getElementById(`pl${playlistId}o1`)!.style.display = 'block';
    }
  }

  private makePlEntry(playlistId: number, psIndex: number) {
    return `
    <div class="plentry">
      <select class="btn sel sel-pl" onchange="plePs(${playlistId},${psIndex},this)" data-val=${this.plJson[playlistId].ps[psIndex]} data-index=${psIndex}>
      ${this.makePlSel()}
      </select>
      <button class="btn btn-i btn-xs btn-pl-del" onclick="delPl(${playlistId},${psIndex})"><i class="icons btn-icon">&#xe037;</i></button>
      <div class="h plnl">Duration</div><div class="h plnl">Transition</div><div class="h pli">#${psIndex + 1}</div><br>
      <input class="noslide pln" type="number" max=6553.0 min=0.2 step=0.1 oninput="pleDur(${playlistId},${psIndex},this)" value=${this.plJson[playlistId].dur[psIndex] / 10.0}>
      <input class="noslide pln" type="number" max=65.0 min=0.0 step=0.1 oninput="pleTr(${playlistId},${psIndex},this)" value=${this.plJson[playlistId].transition[psIndex] / 10.0}> s
      <button class="btn btn-i btn-xs btn-pl-add" onclick="addPl(${playlistId},${psIndex})"><i class="icons btn-icon">&#xe18a;</i></button>
      <div class="hrz"></div>
    </div>`;
  }

  /**
   * Resets create preset/playlist buttons.
   */
  private resetPUtil() {
    const cn = `<button class="btn btn-s btn-i" onclick="makePUtil()"><i class="icons btn-icon">&#xe18a;</i>Create preset</button><br>
  <button class="btn btn-s btn-i" onclick="makePlUtil()"><i class='icons btn-icon'>&#xe139;</i>Create playlist</button><br>`;
    document.getElementById('putil')!.innerHTML = cn;
  }

  private makePlSel(incPl = false /* TODO better name*/) {
    let plSelContent = '';
    delete this.pJson[0];	// remove filler preset
    const presets = Object.entries(this.pJson);
    for (const preset of presets) {
      const presetData = preset[1] as any;
      const n = presetData.n
        ? presetData.n
        : `Preset ${preset[0]}`;
      if (!incPl && presetData.playlist && presetData.playlist.ps) {
        continue; // remove playlists, sub-playlists not yet supported
      }
      plSelContent += `<option value=${preset[0]}>${n}</option>`
    }
    for (let i = 0; i < presets.length; i++) {
    }
    return plSelContent;
  }

  private tglCs(i: number) {
    const pss = getInput(`p${i}cstgl`).checked;
    document.getElementById(`p${i}o1`)!.style.display = pss ? 'block' : 'none';
    document.getElementById(`p${i}o2`)!.style.display = !pss ? 'block' : 'none';
  }

  private saveP(i: number, isPlaylist: boolean) {
    this.pI = parseInt(getInput(`p${i}id`).value);
    if (!this.pI || this.pI < 1) {
      this.pI = (i > 0) ? i : this.getLowestUnusedP();
    }
    this.pN = getInput(`p${i}txt`).value;

    if (this.pN === '') {
      this.pN = (isPlaylist ? 'Playlist ' : 'Preset ') + this.pI;
    }
    let obj: Partial<Obj> = {};

    if (!getInput(`p${i}cstgl`).checked) {
      const raw = (document.getElementById(`p${i}api`)! as HTMLTextAreaElement).value;
      try {
        obj = JSON.parse(raw);
      } catch (e) {
        obj.win = raw;
        if (raw.length < 2) {
          document.getElementById(`p${i}warn`)!.innerHTML =
            '&#9888; Please enter your API command first';
          return;
        } else if (raw.indexOf('{') > -1) {
          document.getElementById(`p${i}warn`)!.innerHTML =
            '&#9888; Syntax error in custom JSON API command';
          return;
        } else if (raw.indexOf('Please') === 0) {
          document.getElementById(`p${i}warn`)!.innerHTML =
            '&#9888; Please refresh the page before modifying this preset';
          return;
        }
      }
      obj.o = true;
    } else {
      if (isPlaylist) {
        obj.playlist = this.plJson[i];
        obj.on = true;
        obj.o = true;
      } else {
        obj.ib = getInput(`p${i}ibtgl`).checked;
        obj.sb = getInput(`p${i}sbtgl`).checked;
      }
    }

    obj.psave = this.pI;
    obj.n = this.pN;
    const pQN = getInput(`p${i}ql`).value;
    if (pQN.length > 0) {
      obj.ql = pQN;
    }

    // TODO api call to save
    // showToast(`Saving ${this.pN} (${pI})`);
    // this.requestJson(obj);
    if (obj.o) {
      this.pJson[this.pI] = obj;
      delete this.pJson[this.pI].psave;
      delete this.pJson[this.pI].o;
      delete this.pJson[this.pI].v;
      delete this.pJson[this.pI].time;
    } else {
      this.pJson[this.pI] = {
        n: this.pN,
        win: 'Please refresh the page to see this newly saved command.',
      };
      if (obj.win) {
        this.pJson[this.pI].win = obj.win;
      }
      if (obj.ql) {
        this.pJson[this.pI].ql = obj.ql;
      }
    }
    // this.populatePresets();
    this.resetPUtil();
  }

  private delP(presetIndex: number) {
    const bt = document.getElementById(`p${presetIndex}del`)!;
    if ((bt as any).dataset.cnf === 1) {
      delete this.pJson[presetIndex];
      const obj = { pdel: presetIndex };
      // TODO api call to save
      // this.requestJson(obj);
      // this.populatePresets();
    } else {
      bt.style.color = '#f00';
      bt.innerHTML = '<i class="icons btn-icon">&#xe037;</i>Confirm delete';
      (bt as any).dataset.cnf = 1; // TODO fix type issue
    }
  }

  // TODO better way to keep track of this?
  private getLowestUnusedP() {
    let min = 1;
    for (const key in this.pJson) {
      if (key === `${min}`) {
        min++;
      }
    }
    return min > 250 ? 250 : min;
  }

  private checkUsed(presetId: number) {
    const id = parseInt(getInput(`p${presetId}id`).value, 10);
    const isUsed = this.pJson[id] && (presetId === 0 || id !== presetId);
    document.getElementById(`p${presetId}warn`)!.innerHTML =  isUsed
      ? `&#9888; Overwriting ${this.getPresetName(id)}!`
      : '';
  }

  private papiVal(presetId: number) {
    if (!this.pJson[presetId]) {
      return '';
    }
    const preset = { ...this.pJson[presetId] };
    if (preset.win) {
      return preset.win;
    }
    delete preset.n;
    delete preset.p;
    delete preset.ql;
    return JSON.stringify(preset);
  }

  private qlName(presetId: number) {
    const hasName = this.pJson[presetId] && this.pJson[presetId].ql;
    return hasName
      ? this.pJson[presetId].ql
      : '';
  }

  /**
   * Copies "backup" json value to clipboard.
   */
  private cpBck() {
    const copyText = document.getElementById('bck')! as HTMLTextAreaElement;

    copyText.select();
    copyText.setSelectionRange(0, 999999);
    document.execCommand('copy');

    // showToast('Copied to clipboard!');
  }

  testPl(playlistId: number, bt: HTMLButtonElement) {
    if ((bt as any).dataset.test === 1) {
      (bt as any).dataset.test = 0;
      bt.innerHTML = "<i class='icons btn-icon'>&#xe139;</i>Test";
      this.stopPl();
      return;
    }
    (bt as any).dataset.test = 1;
    bt.innerHTML = "<i class='icons btn-icon'>&#xe38f;</i>Stop";
    const obj: Partial<Obj> = {};
    obj.playlist = this.plJson[playlistId];
    obj.on = true;

    // TODO api call
    // this.requestJson(obj);
  }

  private stopPl() {
    // TODO api call
    // this.requestJson({ playlist: {} })
  }

  /**
   * Ensure that `dur` and `transition` are arrays with at least the length of `ps`.
   * @param pl 
   */
  private formatArr = (pl: Playlist) => {
    const length1 = pl.ps.length;
    if (!Array.isArray(pl.dur)) {
      // TODO according to typescript this is an impossible case
      // TODO set default `pl.dur` -> pl.dur = [100 || duration];
      /*let duration = pl.dur;
      if (isNaN(duration)) {
        duration = 100;
      }
      pl.dur = [duration];//*/
    }

    let length2 = pl.dur.length;
    if (length2 < length1) {
      for (let i = 0; i < length1 - length2; i++) {
        pl.dur.push(pl.dur[length2 - 1]);
      }
    }

    if (!Array.isArray(pl.transition)) {
      // TODO according to typescript this is an impossible case
      // TODO set default `pl.dur` -> pl.transition = [transition];
      /*let transition = pl.transition;
      if (isNaN(transition)) {
        transition = this.tr;
      }
      pl.transition = [transition];//*/
    }
    length2 = pl.transition.length;
    if (length2 < length1) {
      for (let i = 0; i < length1 - length2; i++) {
        pl.transition.push(pl.transition[length2 - 1]);
      }
    }
  }
}
