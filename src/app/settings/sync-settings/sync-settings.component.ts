import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService, FormValues, createGetFormControl, getFormControl, getFormControlFn } from '../../shared/form-service';
import { SelectItem } from '../shared/settings-types';
import { InputConfig } from 'src/app/shared/text-input/text-input.component';

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

  udpPortInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.syncSettingsForm, 'broadcast.udpPort'),
    placeholder: '',
    widthPx: 120,
  };

  secondPortInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.syncSettingsForm, 'broadcast.secondPort'),
    placeholder: '',
    widthPx: 120,
  };

  startUniverseInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.syncSettingsForm, 'realTime.startUniverse'),
    placeholder: '',
    widthPx: 80,
  };

  dmxStartAddressInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.syncSettingsForm, 'realTime.dmxStartAddress'),
    placeholder: '',
    widthPx: 80,
  };

  timeoutMsInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.syncSettingsForm, 'realTime.timeoutMs'),
    placeholder: '',
    widthPx: 100,
  };

  ledOffsetInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.syncSettingsForm, 'realTime.ledOffset'),
    placeholder: '',
    widthPx: 80,
  };

  alexaInvocationNameInputConfig: InputConfig = {
    type: 'text',
    getFormControl: () => getFormControl(this.syncSettingsForm, 'alexaConfig.invocationName'),
    placeholder: '',
    widthPx: 100,
  };

  blynkHostInputConfig: InputConfig = {
    type: 'text',
    getFormControl: () => getFormControl(this.syncSettingsForm, 'blynkConfig.host'),
    placeholder: '',
    widthPx: 180,
  };

  blynkPortInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.syncSettingsForm, 'blynkConfig.port'),
    placeholder: '',
    widthPx: 100,
  };

  blynkDeviceAuthTokenInputConfig: InputConfig = {
    type: 'text',
    getFormControl: () => getFormControl(this.syncSettingsForm, 'blynkConfig.deviceAuthToken'),
    placeholder: '',
    widthPx: 180,
  };

  mqttBrokerInputConfig: InputConfig = {
    type: 'text',
    getFormControl: () => getFormControl(this.syncSettingsForm, 'mqttConfig.broker'),
    placeholder: '',
    widthPx: 100,
  };

  mqttPortInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.syncSettingsForm, 'mqttConfig.port'),
    placeholder: '',
    widthPx: 100,
  };

  mqttUsernameInputConfig: InputConfig = {
    type: 'text',
    getFormControl: () => getFormControl(this.syncSettingsForm, 'mqttConfig.username'),
    placeholder: '',
    widthPx: 150,
  };

  mqttPasswordInputConfig: InputConfig = {
    type: 'password',
    getFormControl: () => getFormControl(this.syncSettingsForm, 'mqttConfig.password'),
    placeholder: '',
    widthPx: 150,
  };

  mqttClientIdInputConfig: InputConfig = {
    type: 'text',
    getFormControl: () => getFormControl(this.syncSettingsForm, 'mqttConfig.clientId'),
    placeholder: '',
    widthPx: 150,
  };

  mqttDeviceTopicInputConfig: InputConfig = {
    type: 'text',
    getFormControl: () => getFormControl(this.syncSettingsForm, 'mqttConfig.deviceTopic'),
    placeholder: '',
    widthPx: 150,
  };

  mqttGroupTopicInputConfig: InputConfig = {
    type: 'text',
    getFormControl: () => getFormControl(this.syncSettingsForm, 'mqttConfig.groupTopic'),
    placeholder: '',
    widthPx: 150,
  };

  huePollLightIdInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.syncSettingsForm, 'philipsHueConfig.pollLightId'),
    placeholder: '',
    widthPx: 80,
  };

  huePollIntervalMsInputConfig: InputConfig = {
    type: 'number',
    getFormControl: () => getFormControl(this.syncSettingsForm, 'philipsHueConfig.pollIntervalMs'),
    placeholder: '',
    widthPx: 80,
  };

  hueBridgeIpAddressInputConfig: InputConfig = {
    type: 'text',
    getFormControl: () => getFormControl(this.syncSettingsForm, 'philipsHueConfig.hueBridgeIpAddress'),
    placeholder: '',
    widthPx: 180,
  };

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
      deviceList: {
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
