import { Injectable } from '@angular/core';
import { UserModSettings, PickBooleans, PickNonBooleans, WledUserModSettings, convertToWledRequestFormat } from '../shared/settings-types';

// TODO provide in settings services module
@Injectable({ providedIn: 'root' })
export class UserModSettingsTransformerService {
  /**
   * Converts from API response format.
   */
  transformWledUserModSettingsToUserModSettings = (settings: WledUserModSettings): Partial<UserModSettings> => ({
    i2c_sda: settings.SDA,
    i2c_scl: settings.SCL,
    spi_mosi: settings.MOSI,
    spi_miso: settings.MISO,
    spi_sclk: settings.SCLK,
  })

  /**
   * Converts into API response format.
   */
  transformUserModSettingsToWledUserModSettings = (settings: UserModSettings) => {
    const baseOptions: PickNonBooleans<WledUserModSettings> = {
      SDA: settings.i2c_sda,
      SCL: settings.i2c_scl,
      MOSI: settings.spi_mosi,
      MISO: settings.spi_miso,
      SCLK: settings.spi_sclk,
    };
    const booleanOptions: PickBooleans<WledUserModSettings> = {
    };
    return convertToWledRequestFormat<WledUserModSettings>(baseOptions, booleanOptions);
  }
}
