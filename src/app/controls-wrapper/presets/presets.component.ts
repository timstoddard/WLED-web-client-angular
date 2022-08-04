import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UIConfigService } from '../../shared/ui-config.service';
import { LocalStorageKey, LocalStorageService } from '../../shared/local-storage.service';
import { generateApiUrl } from '../json.service';
import { getInput, isObject } from '../utils';
import { UnsubscribingComponent } from '../../shared/unsubscribing/unsubscribing.component';

interface Playlists { [key: number]: Playlist }
interface Playlist {
  ps: number[]; // [0],
  dur: number[]; // [100],
  transition: number[]; // [-1],	// to be initiated to default transition dur
  repeat: number; // 0,
  r: boolean; // false,
  end?: number; // 0,
}

interface Presets { [key: number]: Preset }

interface Preset {
  /** Preset name */
  n: string
  /** Playlist associated with this preset */
  playlist: Playlist
  psave: any /* TODO type */
  o: any /* TODO type */
  v: any /* TODO type */
  time: any /* TODO type */
  win: any /* TODO type */
  /** Quick load label */
  ql: string
  on: any
  ib: any
  sb: any

  p: any // TODO seems to be used?
}

// TODO seems to be same as Preset?
// interface Obj {
//   n: string;
//   playlist: Playlist;
//   psave: number;
//   o: boolean;
//   // missing v
//   // missing time  
//   win: string; // backup stringified json
//   ql: string;
//   on: boolean;
//   ib: boolean;
//   sb: boolean;
// }

interface PresetError {
  isEmpty: boolean;
  message: string;
  backupString: string;
}

@Component({
  selector: 'app-presets',
  templateUrl: './presets.component.html',
  styleUrls: ['./presets.component.scss']
})
export class PresetsComponent extends UnsubscribingComponent implements OnInit {
  @Input() useLocalStorage: boolean = true;
  @ViewChild('backupString', { read: ElementRef }) backupStringTextArea!: ElementRef<HTMLTextAreaElement>;
  showPresetIds!: boolean;
  presetError!: PresetError;
  templateType: string = 'default'; // TODO more specific type
  private presets: Presets = {};
  private pQL: any[] = []; /* TODO type */
  private presetCount = 0;
  private pmt = 1;
  private pmtLS = 0;
  private pmtLast = 0;
  private expanded = [false];
  private currentPreset = -1;
  private tr = 0.7;
  private pName = ''; // current playlist/preset name
  private playlistIndex = 0; // current playlist/preset id
  private playlists: Playlists = this.getDefaultPlaylist();

  constructor(
    private localStorageService: LocalStorageService,
    private uiConfigService: UIConfigService,
  ) {
    super();
  }

  ngOnInit() {
    this.uiConfigService.getUIConfig(this.ngUnsubscribe)
      .subscribe((uiConfig) => {
        this.showPresetIds = uiConfig.showPresetIds;
      });

    if (this.useLocalStorage) {
      const storedPresets = this.localStorageService.get<Presets>(LocalStorageKey.SAVED_PRESETS);
      if (storedPresets) {
        this.presets = storedPresets;
      }
    }
    delete this.presets[0]; // delete default preset
    let cn = '';
    const presets = this.getPresetsList(true);
    // const presets = Object.entries(this.presets);
    presets.sort(this.sortPresetsByName);
    this.pQL = [];
    const is = [];
    this.presetCount = 0;
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
        const quickLoadLabel = preset[1].ql;
        if (quickLoadLabel) {
          this.pQL.push([i, quickLoadLabel]);
        }
        is.push(i);

        cn += `<div class="seg pres" id="p${i}o">`;
        if (this.showPresetIds) {
          cn += `<div class="pid">${i}</div>`;
        }
        cn += `<div class="segname pname" onclick="setPreset(${i})">${this.isPlaylist(i) ? "<i class='icons btn-icon'>&#xe139;</i>" : ''}${this.getPresetNameById(i)}</div>
          <i class="icons e-icon flr ${this.expanded[i + 100] ? "exp" : ''}" id="sege${i + 100}" onclick="expand(${i + 100})">&#xe395;</i>
          <div class="segin" id="seg${i + 100}"></div>
        </div><br>`;
        this.presetCount++;
      }
    }

    // document.getElementById('pcont')!.innerHTML = cn;

    if (this.presetCount > 0) {
      if (this.pmtLS !== this.pmt && this.pmt !== 0) {
        this.localStorageService.set('wledPmt', this.pmt);
        this.presets[0] = {};
        this.localStorageService.set('wledP', this.presets);
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
      this.showPresetError(true);
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
        this.presets = json;
        // this.populatePresets();
      })
      .catch((error) => {
        // showToast(error, true);
        console.log(error);
        this.showPresetError(false);
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
    return this.presets[i].playlist && this.presets[i].playlist.ps;
  }

  private sortPresetsByName = (a: any /* TODO type */, b: any /* TODO type */) => {
    if (!a[1].n) {
      return a[0] > b[0];
    }
    return a[1].n.localeCompare(b[1].n, undefined, { numeric: true });
  }

  getPresetErrorMessage(isEmpty: boolean) {
    return isEmpty
      ? `You have no presets yet!`
      : `Sorry, there was an issue loading your presets!`
  }

  private showPresetError(isEmpty: boolean) {
    let backupString = '';
    try {
      backupString = JSON.stringify(this.localStorageService.get(LocalStorageKey.SAVED_PRESETS));
    } catch (e) {
      // TODO display message in UI
    }

    const message = isEmpty
      ? 'You have no presets yet!'
      : 'Sorry, there was an issue loading your presets!';
    this.presetError = {
      isEmpty,
      message,
      backupString,
    };
  }

  private setPreset(presetId: number) {
    const obj: any = { ps: presetId };
    if (this.isPlaylist(presetId)) {
      obj.on = true; // force on
    }
    // showToast(`Loading preset ${this.getPresetNameById(presetId)} (${presetId})`);
    // this.requestJson(obj);
  }

  private getPresetNameById(presetId: number) {
    return this.presets[presetId].n
      ? this.presets[presetId].n
      : `Preset ${presetId}`;
  }

  getPresetNameV2(preset: Preset) {
    return preset.n
      ? preset.n
      : `Preset ${preset[0]}`;
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
      this.playlists[p] = this.presets[p].playlist;
      // make sure all keys are present in this.plJson[p]
      this.validatePlaylist(this.playlists[p]);
      const getDefaultPlaylist = (): Playlist => ({
        repeat: 0,
        r: false,
        end: 0,
        // TODO complete this list
      })
      // if (isNaN(this.playlists[p].repeat)) {
      //   this.playlists[p].repeat = 0;
      // }
      // if (!this.playlists[p].r) {
      //   this.playlists[p].r = false;
      // }
      // if (isNaN(this.playlists[p].end as number)) {
      //   this.playlists[p].end = 0;
      // }

      document.getElementById('seg' + i)!.innerHTML = this.createPresetOrPlaylist(p, true);
      this.refreshPlE(p);
    } else {
      document.getElementById('seg' + i)!.innerHTML = this.createPresetOrPlaylist(p);
    }
    const plApiValue = this.getPlApiValue(p);
    (document.getElementById(`p${p}api`)! as HTMLTextAreaElement).value = plApiValue;
    // TODO how is this branch triggered
    if (plApiValue.indexOf('Please') === 0) {
      getInput(`p${p}cstgl`).checked = true;
    }
    this.toggleUseCurrentState(p);
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

  private createPlaylist() {
    if (this.presetCount < 2) {
      // showToast('You need at least 2 presets to make a playlist!');
      return;
    }
    // TODO what is this checking?
    if (this.playlists[0].transition[0] < 0) {
      this.playlists[0].transition[0] = this.tr;
    }
    this.templateType = 'createPlaylist'
    // document.getElementById('putil')!.innerHTML = `<div class="seg pres">
    // <div class="segname newseg">
    //   New playlist</div>
    // <div class="segin expanded" id="seg100">
    // ${this.createPresetOrPlaylist(0, true)}</div></div>`;

    this.refreshPlE(0);
  }

  private createPresetOrPlaylist(id: number, isPlaylist = false) {
    let content = '';
    if (isPlaylist) {
      const rep = this.playlists[id].repeat
        ? this.playlists[id].repeat
        : 0;
      // createForm1
  //     content = `<div class="first c">Playlist Entries</div>
  // <div id="ple${id}"></div>
  // <label class="check revchkl">
  //   Shuffle
  //   <input type="checkbox" id="pl${id}rtgl" onchange="plR(${id})" ${this.plJson[id].r ? 'checked' : ''}>
  //   <span class="checkmark schk"></span>
  // </label>
  // <label class="check revchkl">
  //   Repeat indefinitely
  //   <input type="checkbox" id="pl${id}rptgl" onchange="plR(${id})" ${rep ? "" : "checked"}>
  //   <span class="checkmark schk"></span>
  // </label>
  // <div id="pl${id}o1" style="display:${rep ? "block" : "none"}">
  //   <div class="c">Repeat <input class="noslide" type="number" id="pl${id}rp" oninput="plR(${id})" max=127 min=0 value=${rep > 0 ? rep : 1}> times</div>
  //   End preset:<br>
  //   <select class="btn sel sel-ple" id="pl${id}selEnd" onchange="plR(${id})" data-val=${this.plJson[id].end ? this.plJson[id].end : 0}>
  //     <option value=0>None</option>
  //     ${this.makePlSel(true)}
  //   </select>
  // </div>
  // <button class="btn btn-i btn-p" onclick="testPl(${id}, this)"><i class='icons btn-icon'>&#xe139;</i>Test</button>`;
    }
  //   else content = `<label class="check revchkl">
  //   Include brightness
  //   <input type="checkbox" id="p${id}ibtgl" checked>
  //   <span class="checkmark schk"></span>
  // </label>
  // <label class="check revchkl">
  //   Save segment bounds
  //   <input type="checkbox" id="p${id}sbtgl" checked>
  //   <span class="checkmark schk"></span>
  // </label>`;

  return ''
  //   return `<input type="text" class="ptxt noslide" id="p${id}txt" autocomplete="off" maxlength=32 value="${(id > 0) ? this.getPresetNameById(id) : ""}" placeholder="Enter name..."/><br>
  // <div class="c">Quick load label: <input type="text" class="qltxt noslide" maxlength=2 value="${this.getQuickLoadLabel(id)}" id="p${id}ql" autocomplete="off"/></div>
  // <div class="h">(leave empty for no Quick load button)</div>
  // <div ${isPlaylist && id === 0 ? "style='display:none'" : ""}>
  //   <label class="check revchkl">
  //     ${isPlaylist ? "Show playlist editor" : (id > 0) ? "Overwrite with state" : "Use current state"}
  //     <input type="checkbox" id="p${id}cstgl" onchange="toggleUseCurrentState(${id})" ${(id === 0 || isPlaylist) ? "checked" : ""}>
  //     <span class="checkmark schk"></span>
  //   </label><br>
  // </div>
  // <div class="po2" id="p${id}o2">
  //   API command<br>
  //   <textarea class="noslide" id="p${id}api"></textarea>
  // </div>
  // <div class="po1" id="p${id}o1">
  //   ${content}
  // </div>
  // <div class="c">Save to ID <input class="noslide" id="p${id}id" type="number" oninput="checkUsed(${id})" max=250 min=1 value=${(id > 0) ? id : this.getLowestUnusedPlId()}></div>
  // <div class="c">
  //   <button class="btn btn-i btn-p" onclick="savePlaylistOrPreset(${id},${isPlaylist})"><i class="icons btn-icon">&#xe390;</i>Save ${(isPlaylist) ? 'playlist' : (id > 0) ? 'changes' : 'preset'}</button>
  //   ${(id > 0) ? '<button class="btn btn-i btn-p" id="p' + id + 'del" onclick="deleteP(' + id + ')"><i class="icons btn-icon">&#xe037;</i>Delete ' + (isPlaylist ? 'playlist' : 'preset') :
  //       '<button class="btn btn-p" onclick="resetPUtil()">Cancel'}</button>
  // </div>
  // <div class="pwarn ${(id > 0) ? 'bp' : ''} c" id="p${id}warn">

  // </div>
  // ${(id > 0) ? ('<div class="h">ID ' + id + '</div>') : ''}`;
  }

  private makePUtil() {
    // document.getElementById('putil')!.innerHTML = `<div class="seg pres">
    // <div class="segname newseg">
    //   New preset</div>
    // <div class="segin expanded">
    // ${this.createPresetOrPlaylist(0)}</div></div>`;
  }

  private refreshPlE(playlistId: number) {
    const plEDiv = document.getElementById(`ple${playlistId}`);
    if (!plEDiv) {
      return;
    }
    let content = '';
    for (let i = 0; i < this.playlists[playlistId].ps.length; i++) {
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
          this.playlists[playlistId].ps[index] = parseInt(i.value);
        }
      }
    }
  }

  private addPl(playlistId: number, psIndex: number) {
    this.playlists[playlistId].ps.splice(psIndex + 1, 0, 0);
    this.playlists[playlistId].dur.splice(psIndex + 1, 0, this.playlists[playlistId].dur[psIndex]);
    this.playlists[playlistId].transition.splice(psIndex + 1, 0, this.playlists[playlistId].transition[psIndex]);
    this.refreshPlE(playlistId);
  }

  private delPl(playlistId: number, psIndex: number) {
    if (this.playlists[playlistId].ps.length < 2) {
      return;
    }
    this.playlists[playlistId].ps.splice(psIndex, 1);
    this.playlists[playlistId].dur.splice(psIndex, 1);
    this.playlists[playlistId].transition.splice(psIndex, 1);
    this.refreshPlE(playlistId);
  }

  plePs(playlistId: number, psIndex: number, field: HTMLSelectElement) {
    this.playlists[playlistId].ps[psIndex] = parseInt(field.value);
  }

  pleDur(playlistId: number, psIndex: number, field: HTMLInputElement) {
    if (field.validity.valid) {
      const dur = Math.floor(parseInt(field.value, 10) * 10);
      this.playlists[playlistId].dur[psIndex] = dur;
    }
  }

  pleTr(playlistId: number, psIndex: number, field: HTMLInputElement) {
    if (field.validity.valid) {
      const transition = Math.floor(parseInt(field.value, 10) * 10);
      this.playlists[playlistId].transition[psIndex] = transition;
    }
  }

  private plR(playlistId: number) {
    const playlist = this.playlists[playlistId];
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
      <select class="btn sel sel-pl" onchange="plePs(${playlistId},${psIndex},this)" data-val=${this.playlists[playlistId].ps[psIndex]} data-index=${psIndex}>
      ${this.makePlSel()}
      </select>
      <button class="btn btn-i btn-xs btn-pl-del" onclick="delPl(${playlistId},${psIndex})"><i class="icons btn-icon">&#xe037;</i></button>
      <div class="h plnl">Duration</div><div class="h plnl">Transition</div><div class="h pli">#${psIndex + 1}</div><br>
      <input class="noslide pln" type="number" max=6553.0 min=0.2 step=0.1 oninput="pleDur(${playlistId},${psIndex},this)" value=${this.playlists[playlistId].dur[psIndex] / 10.0}>
      <input class="noslide pln" type="number" max=65.0 min=0.0 step=0.1 oninput="pleTr(${playlistId},${psIndex},this)" value=${this.playlists[playlistId].transition[psIndex] / 10.0}> s
      <button class="btn btn-i btn-xs btn-pl-add" onclick="addPl(${playlistId},${psIndex})"><i class="icons btn-icon">&#xe18a;</i></button>
      <div class="hrz"></div>
    </div>`;
  }

  // TODO rename function
  /**
   * Resets create preset/playlist buttons.
   */
  private resetPUtil() {
    this.templateType = 'default'
  //   const cn = `<button class="btn btn-s btn-i" onclick="makePUtil()"><i class="icons btn-icon">&#xe18a;</i>Create preset</button><br>
  // <button class="btn btn-s btn-i" onclick="makePlUtil()"><i class='icons btn-icon'>&#xe139;</i>Create playlist</button><br>`;
  //   document.getElementById('putil')!.innerHTML = cn;
  }

  /**
   * Returns an array of the presets/playlists.
   * @param incPl 
   * @returns 
   */
  getPresetsList(incPl = false /* TODO better name*/) {
    return Object
      .entries(this.presets)
      .filter((preset: Preset) => {
        const isPlaylist = preset.playlist && preset.playlist.ps
        // remove playlists, sub-playlists not yet supported
        return incPl || !isPlaylist
      })
  }

  private makePlSel(incPl = false /* TODO better name*/) {
    let plSelContent = '';
    delete this.presets[0];	// remove filler preset
    const presetsList = Object.entries(this.presets);
    for (const preset of presetsList) {
      const presetData = preset[1] as any; // TODO type
      const presetName = presetData.n
        ? presetData.n
        : `Preset ${preset[0]}`;
      if (!incPl && presetData.playlist && presetData.playlist.ps) {
        continue; // remove playlists, sub-playlists not yet supported
      }
      plSelContent += `<option value=${preset[0]}>${presetName}</option>`
    }
    for (let i = 0; i < presetsList.length; i++) {
    }
    return plSelContent;
  }

  private toggleUseCurrentState(i: number) {
    const shouldUseCurrentState = getInput(`p${i}cstgl`).checked;
    document.getElementById(`p${i}o1`)!.style.display = shouldUseCurrentState ? 'block' : 'none';
    document.getElementById(`p${i}o2`)!.style.display = !shouldUseCurrentState ? 'block' : 'none';
  }

  private savePlaylistOrPreset(pIndex: number, isPlaylist: boolean) {
    this.playlistIndex = parseInt(getInput(`p${pIndex}id`).value);
    if (!this.playlistIndex || this.playlistIndex <= 0) {
      this.playlistIndex = (pIndex > 0) ? pIndex : this.getLowestUnusedPlId();
    }
    this.pName = getInput(`p${pIndex}txt`).value;

    if (!this.pName) {
      const pType = isPlaylist ? 'Playlist' : 'Preset';
      this.pName = `${pType} ${this.playlistIndex}`;
    }
    let obj: Partial<Preset> = {};

    if (!getInput(`p${pIndex}cstgl`).checked) {
      const raw = (document.getElementById(`p${pIndex}api`)! as HTMLTextAreaElement).value;
      try {
        obj = JSON.parse(raw);
      } catch (e) {
        obj.win = raw;
        const getWarning = () => {
          if (raw.length < 2) {
            return '&#9888; Please enter your API command first';
          } else if (raw.indexOf('{') > -1) {
            return '&#9888; Syntax error in custom JSON API command';
          } else if (raw.indexOf('Please') === 0) {
            return '&#9888; Please refresh the page before modifying this preset';
          }
        }
        const warningMessage = getWarning()
        if (warningMessage) {
          document.getElementById(`p${pIndex}warn`)!.innerHTML = warningMessage;
          return;
        }
      }
      obj.o = true;
    } else {
      if (isPlaylist) {
        obj.playlist = this.playlists[pIndex];
        obj.on = true;
        obj.o = true;
      } else {
        obj.ib = getInput(`p${pIndex}ibtgl`).checked;
        obj.sb = getInput(`p${pIndex}sbtgl`).checked;
      }
    }

    obj.psave = this.playlistIndex;
    obj.n = this.pName;
    const plQuickLoadLabel = getInput(`p${pIndex}ql`).value;
    if (plQuickLoadLabel.length > 0) {
      obj.ql = plQuickLoadLabel;
    }

    // TODO api call to save
    // showToast(`Saving ${this.pN} (${pI})`);
    // this.requestJson(obj);
    if (obj.o) {
      this.presets[this.playlistIndex] = obj;
      delete this.presets[this.playlistIndex].psave;
      delete this.presets[this.playlistIndex].o;
      delete this.presets[this.playlistIndex].v;
      delete this.presets[this.playlistIndex].time;
    } else {
      this.presets[this.playlistIndex] = {
        n: this.pName,
        win: 'Please refresh the page to see this newly saved command.',
      };
      if (obj.win) {
        this.presets[this.playlistIndex].win = obj.win;
      }
      if (obj.ql) {
        this.presets[this.playlistIndex].ql = obj.ql;
      }
    }
    // this.populatePresets();
    this.resetPUtil();
  }

  private deleteP(presetIndex: number) {
    const bt = document.getElementById(`p${presetIndex}del`)!;
    if ((bt as any).dataset.cnf === 1) {
      delete this.presets[presetIndex];
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
  getLowestUnusedPlId() {
    let min = 1;
    for (const key in this.presets) {
      if (key === `${min}`) {
        min++;
      }
    }
    return min > 250 ? 250 : min;
  }

  private checkUsed(presetFormId: number) {
    const presetId = parseInt(getInput(`p${presetFormId}id`).value, 10);
    const hasPreset = presetFormId === 0 || presetId !== presetFormId;
    const isUsed = this.presets[presetId] && hasPreset;
    return isUsed
      ? `&#9888; Overwriting ${this.getPresetNameById(presetId)}!`
      : '';
    // document.getElementById(`p${presetFormId}warn`)!.innerHTML =  isUsed
    //   ? `&#9888; Overwriting ${this.getPresetNameById(presetId)}!`
    //   : '';
  }

  private getPlApiValue(presetId: number) {
    if (!this.presets[presetId]) {
      return '';
    }
    const preset = { ...this.presets[presetId] };
    if (preset.win) {
      return preset.win;
    }
    const fieldsToRemove: Array<keyof Preset> = ['n', 'p', 'ql']
    for (const fieldName of fieldsToRemove) {
      delete preset[fieldName]
    }
    // delete preset.n;
    // delete preset.p;
    // delete preset.ql;
    return JSON.stringify(preset);
  }

  getQuickLoadLabel(presetId: number) {
    const hasLabel = this.presets[presetId] && this.presets[presetId].ql;
    return hasLabel
      ? this.presets[presetId].ql
      : '';
  }

  /**
   * Copies "backup" json value to clipboard.
   */
  copyBackupJsonString() {
    const copyText = this.backupStringTextArea.nativeElement;

    copyText.select();
    // TODO better way to copy? small lib maybe?
    // TODO can we not hardcode the upper limit?
    copyText.setSelectionRange(0, 999999);
    document.execCommand('copy');

    // TODO display message in UI 
    // showToast('Copied to clipboard!');
  }

  testPl(playlistId: number, bt: HTMLButtonElement) {
    if ((bt as any).dataset.test === 1) {
      (bt as any).dataset.test = 0;
      bt.innerHTML = "<i class='icons btn-icon'>&#xe139;</i>Test";
      this.stopPlaylist();
      return;
    } else {
      (bt as any).dataset.test = 1;
      bt.innerHTML = "<i class='icons btn-icon'>&#xe38f;</i>Stop";
      const preset: Partial<Preset> = {};
      preset.playlist = this.playlists[playlistId];
      preset.on = true;

      // TODO api call
      // this.requestJson(preset);
    }
  }

  private stopPlaylist() {
    // TODO api call
    // this.requestJson({ playlist: {} })
  }

  /**
   * Ensure that `dur` and `transition` are arrays with at least the length of `ps`.
   * @param playlist 
   */
  private validatePlaylist = (playlist: Playlist) => {
    const length1 = playlist.ps.length;
    if (!Array.isArray(playlist.dur)) {
      // TODO according to typescript this is an impossible case
      // TODO set default `pl.dur` -> pl.dur = [100 || duration];
      let duration = playlist.dur as number;
      if (isNaN(duration)) {
        duration = 100;
      }
      playlist.dur = [duration];
    }

    let length2 = playlist.dur.length;
    if (length2 < length1) {
      for (let i = 0; i < length1 - length2; i++) {
        playlist.dur.push(playlist.dur[length2 - 1]);
      }
    }

    if (!Array.isArray(playlist.transition)) {
      let transition = playlist.transition as number;
      if (isNaN(transition)) {
        transition = this.tr;
      }
      playlist.transition = [transition];
    }
    length2 = playlist.transition.length;
    if (length2 < length1) {
      for (let i = 0; i < length1 - length2; i++) {
        playlist.transition.push(playlist.transition[length2 - 1]);
      }
    }
  }
}
