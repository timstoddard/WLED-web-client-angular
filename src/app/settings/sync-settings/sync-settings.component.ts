import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sync-settings',
  templateUrl: './sync-settings.component.html',
  styleUrls: ['./sync-settings.component.scss']
})
export class SyncSettingsComponent implements OnInit {
  syncSettingsForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.syncSettingsForm = this.createForm();
  }

  submitForm() {
    // TODO
  }

  private createForm() {
    return this.formBuilder.group({
      buttonType: this.formBuilder.control('', Validators.required),
      // TODO should this be a boolean/checkbox?
      irRemote: this.formBuilder.control('', Validators.required),
      udpPort: this.formBuilder.control(21324, Validators.required),
      secondPort: this.formBuilder.control(65506, Validators.required),
      receive: this.formBuilder.group({
        brightness: this.formBuilder.control(true, Validators.required),
        color: this.formBuilder.control(true, Validators.required),
        effects: this.formBuilder.control(true, Validators.required),
      }),
      notify: this.formBuilder.group({
        onDirectChange: this.formBuilder.control(false, Validators.required),
        onButtonPressOrIr: this.formBuilder.control(false, Validators.required),
        alexa: this.formBuilder.control(false, Validators.required),
        philipsHue: this.formBuilder.control(false, Validators.required),
        macro: this.formBuilder.control(false, Validators.required),
        sendTwice: this.formBuilder.control(false, Validators.required),
      }),
      instanceList: this.formBuilder.group({
        enable: this.formBuilder.control(true, Validators.required),
        isThisInstanceDiscoverable: this.formBuilder.control(true, Validators.required),
      }),
      realTime: this.formBuilder.group({
        receiveUdpRealTime: this.formBuilder.control(true, Validators.required),
        dmxType: this.formBuilder.control('', Validators.required),
        multicast: this.formBuilder.control(false, Validators.required),
        startUniverse: this.formBuilder.control(1, Validators.required),
        skipOutOfSequencePackets: this.formBuilder.control(true, Validators.required),
        dmxStartAddress: this.formBuilder.control(1, Validators.required),
        dmxMode: this.formBuilder.control('', Validators.required),
        timeout: this.formBuilder.control(2500, Validators.required),
        forceMaxBrightness: this.formBuilder.control(false, Validators.required),
        disableGammaCorrection: this.formBuilder.control(true, Validators.required),
        ledOffset: this.formBuilder.control(0, Validators.required),
      }),
      alexaConfig: this.formBuilder.group({
        emulateDevice: this.formBuilder.control(true, Validators.required),
        invocationName: this.formBuilder.control('Light', Validators.required),
      }),
      blynkConfig: this.formBuilder.group({
        host: this.formBuilder.control('blynk-cloud.com', Validators.required),
        port: this.formBuilder.control(80, Validators.required),
        deviceAuthToken: this.formBuilder.control('', Validators.required),
      }),
      mqttConfig: this.formBuilder.group({
        enable: this.formBuilder.control(false, Validators.required),
        broker: this.formBuilder.control('', Validators.required),
        port: this.formBuilder.control(1883, Validators.required),
        username: this.formBuilder.control('', Validators.required),
        password: this.formBuilder.control('', Validators.required),
        clientId: this.formBuilder.control('WLED-f6dafd', Validators.required),
        deviceTopic: this.formBuilder.control('wled/f6dafd', Validators.required),
        groupTopic: this.formBuilder.control('wled/all', Validators.required),
      }),
      philipsHueConfig: this.formBuilder.group({
        pollLightId: this.formBuilder.control(1, Validators.required),
        pollIntervalMs: this.formBuilder.control(2500, Validators.required),
        receive: this.formBuilder.group({
          onOff: this.formBuilder.control(true, Validators.required),
          brightness: this.formBuilder.control(true, Validators.required),
          color: this.formBuilder.control(true, Validators.required),
        }),
        hueBridgeIpAddress: this.formBuilder.control('', Validators.required),
      }),
    });
  }
}
