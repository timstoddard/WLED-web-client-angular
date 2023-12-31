import { TestBed } from '@angular/core/testing';
import { InfoService } from './info.service';
import { StateApiService } from '../../shared/api-service/state-api.service';
import { AppStateService } from '../../shared/app-state/app-state.service';
import { ApiTypeMapper } from '../../shared/api-type-mapper';

fdescribe('InfoService', () => {
  let infoService: InfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InfoService,
        { provide: StateApiService, useValue: {} },
        { provide: AppStateService, useValue: {} },
        { provide: ApiTypeMapper, useValue: {} },
      ],
    });
    infoService = TestBed.inject(InfoService);
  });

  describe('getRuntimeString', () => {
    it('should work for a total runtime of one second', () => {
      // arrange
      const runtimeSeconds = 1; // 1 second
      const expectedResult = '1 sec';
      // act
      const actualResult = infoService.getRuntimeString(runtimeSeconds);
      // assert
      expect(actualResult).toEqual(expectedResult);
    });
    
    it('should work for a total runtime of multiple seconds', () => {
      // arrange
      const runtimeSeconds = 32; // 32 seconds
      const expectedResult = '32 secs';
      // act
      const actualResult = infoService.getRuntimeString(runtimeSeconds);
      // assert
      expect(actualResult).toEqual(expectedResult);
    });
  
    it('should work for a total runtime of one minute', () => {
      // arrange
      const runtimeSeconds = 60; // 1 minute
      const expectedResult = '1 min, 0 secs';
      // act
      const actualResult = infoService.getRuntimeString(runtimeSeconds);
      // assert
      expect(actualResult).toEqual(expectedResult);
    });
    
    it('should work for a total runtime of multiple minutes', () => {
      // arrange
      const runtimeSeconds = 123; // 2 minutes 3 seconds
      const expectedResult = '2 mins, 3 secs';
      // act
      const actualResult = infoService.getRuntimeString(runtimeSeconds);
      // assert
      expect(actualResult).toEqual(expectedResult);
    });
  
    it('should work for a total runtime of one hour', () => {
      // arrange
      const runtimeSeconds = 3600; // 1 hour
      const expectedResult = '1 hour, 0 mins';
      // act
      const actualResult = infoService.getRuntimeString(runtimeSeconds);
      // assert
      expect(actualResult).toEqual(expectedResult);
    });
    
    it('should work for a total runtime of multiple hours', () => {
      // arrange
      const runtimeSeconds = 10000; // 2 hours 46 minutes 40 seconds
      const expectedResult = '2 hours, 46 mins';
      // act
      const actualResult = infoService.getRuntimeString(runtimeSeconds);
      // assert
      expect(actualResult).toEqual(expectedResult);
    });
  
    it('should work for a total runtime of one day', () => {
      // arrange
      const runtimeSeconds = 86400; // 1 day
      const expectedResult = '1 day, 0 hours';
      // act
      const actualResult = infoService.getRuntimeString(runtimeSeconds);
      // assert
      expect(actualResult).toEqual(expectedResult);
    });
    
    it('should work for a total runtime of multiple days', () => {
      // arrange
      const runtimeSeconds = 200000; // 2 days 7 hours 33 minutes 20 seconds
      const expectedResult = '2 days, 7 hours';
      // act
      const actualResult = infoService.getRuntimeString(runtimeSeconds);
      // assert
      expect(actualResult).toEqual(expectedResult);
    });
  })
});
