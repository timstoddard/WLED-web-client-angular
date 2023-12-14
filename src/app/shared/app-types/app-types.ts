import { AppInfo } from './app-info';
import { AppNode } from './app-nodes';
import { AppPreset } from './app-presets';
import { AppWLEDState } from './app-state';

export interface AppState {
  /** WLED app state. */
  state: AppWLEDState;
  /** Read-only info about WLED and its configuration. */
  info: AppInfo;
  /** List of effect names. */
  effects: string[];
  /** List of palette names. */
  palettes: string[];
  /** Client-only global app settings. */
  localSettings: AppClientConfig; // TODO rename field to clientConfig
  /** List of all discovered WLED nodes. */
  nodes: AppNode[];
  /** User-configured presets. */
  presets: AppPreset[];
}

/** Client-only global app settings. */
export interface AppClientConfig {
  /** `true` if live view is active. */
  isLiveViewActive: boolean;
  // TODO can this be a string? (pros/cons)
  /** Current connected WLED instance. */
  selectedWLEDIpAddress: WLEDIpAddress;
  /** User-configured list of WLED instances. */
  wledIpAddresses: WLEDIpAddress[];
  /** Setting to toggle PC mode on/off. */
  isPcMode: boolean;
}

/** Represents a singular WLED instance. */
export interface WLEDIpAddress {
  /** WLED instance name. */
  name: string;
  /** WLED instance IP v4 address. */
  ipv4Address: string;
}
