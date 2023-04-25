import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService, FormValues } from '../../shared/form-service';
import { SelectItem } from '../shared/settings-types';
import { createGetFormControl, getFormControlFn } from 'src/app/controls-wrapper/utils';

@Component({
  selector: 'app-sync-settings',
  templateUrl: './sync-settings.component.html',
  styleUrls: ['./sync-settings.component.scss']
})
export class SyncSettingsComponent implements OnInit {
  syncSettingsForm!: FormGroup;

  buttonTypeOptions: SelectItem<number>[] = [
    {
      name: 'Disabled',
      value: 0,
    },
    {
      name: 'Pushbutton',
      value: 2,
    },
    {
      name: 'Push inverted',
      value: 3,
    },
    {
      name: 'Switch',
      value: 4,
    },
    {
      name: 'PIR sensor',
      value: 5,
    },
    {
      name: 'Touch',
      value: 6,
    },
    {
      name: 'Analog',
      value: 7,
    },
    {
      name: 'Analog inverted',
      value: 8,
    },
  ];

  irRemoteOptions: SelectItem<number>[] = [
    {
      name: 'Remote disabled',
      value: 0,
    },
    {
      name: '24-key RGB',
      value: 1,
    },
    {
      name: '24-key with CT',
      value: 2,
    },
    {
      name: '40-key blue',
      value: 3,
    },
    {
      name: '44-key RGB',
      value: 4,
    },
    {
      name: '21-key RGB',
      value: 5,
    },
    {
      name: '6-key black',
      value: 6,
    },
    {
      name: '9-key red',
      value: 7,
    },
    {
      name: 'JSON remote',
      value: 8,
    },
  ];

  dmxTypeOptions: SelectItem<number>[] = [
    {
      name: 'E1.31 (sACN)',
      value: 5568,
    },
    {
      name: 'Art-Net',
      value: 6454,
    },
    {
      name: 'DDP',
      value: -1, // TODO get from newer version?
    },
    {
      name: 'Custom port',
      value: 0,
    },
  ];

  dmxModeOptions: SelectItem<number>[] = [
    {
      name: 'Disabled',
      value: 0,
    },
    {
      name: 'Single RGB',
      value: 1,
    },
    {
      name: 'Single DRGB',
      value: 2,
    },
    {
      name: 'Effect',
      value: 3,
    },
    {
      name: 'Multi RGB',
      value: 4,
    },
    {
      name: 'Dimmer + Multi RGB',
      value: 5,
    },
    {
      name: 'Multi RGBW',
      value: 6,
    },
  ];
  getFormControl!: getFormControlFn;

  constructor(private formService: FormService) { }

  ngOnInit() {
    this.syncSettingsForm = this.createForm();
    this.getFormControl = createGetFormControl(this.syncSettingsForm);
  }

  submitForm() {
    // TODO
  }

  private createForm() {
    return this.formService.createFormGroup(this.getDefaultFormValues());
  }

  private getDefaultFormValues(): FormValues {
    return {
      button: {
        type: 2,
        irRemote: 0,
      },
      broadcast: {
        udpPort: 21324,
        secondPort: 65506,
        receive: {
          brightness: true,
          color: true,
          effects: true,
        },
        notify: {
          onDirectChange: false,
          onButtonPressOrIr: false,
          alexa: false,
          philipsHue: false,
          macro: false,
          sendTwice: false,
        },
      },
      instanceList: {
        enable: true,
        isThisInstanceDiscoverable: true,
      },
      realTime: {
        receiveUdpRealTime: true,
        dmxType: 5568,
        multicast: false,
        startUniverse: 1,
        skipOutOfSequencePackets: true,
        dmxStartAddress: 1,
        dmxMode: 4,
        timeoutMs: 2500,
        forceMaxBrightness: false,
        disableGammaCorrection: true,
        ledOffset: 0,
      },
      alexaConfig: {
        emulateDevice: true,
        invocationName: 'Light',
      },
      blynkConfig: {
        host: 'blynk-cloud.com',
        port: 80,
        deviceAuthToken: '',
      },
      mqttConfig: {
        enable: false,
        broker: '',
        port: 1883,
        username: '',
        password: '',
        clientId: 'WLED-f6dafd',
        deviceTopic: 'wled/f6dafd',
        groupTopic: 'wled/all',
      },
      philipsHueConfig: {
        enable: false,
        pollLightId: 1,
        pollIntervalMs: 2500,
        receive: {
          onOff: true,
          brightness: true,
          color: true,
        },
        hueBridgeIpAddress: '',
      },
    };
  }
}
