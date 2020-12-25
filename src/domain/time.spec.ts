import {formatTime, formatTimeOmitHour} from './time';

describe('Having a time in milliseconds', function () {
  it('formatting should return time on 00:00:00 format', function () {
    expect(formatTime((1 * 60 * 60) + (10 * 60) + (43))).toEqual('01:10:43');
  });

  it('formatting pad zeros', function () {
    expect(formatTime((1 * 60 * 60) + (10 * 60) + (3))).toEqual('01:10:03');
  });

  it('formatting time without hours', () => {
    expect(formatTimeOmitHour((10 * 60) + (43))).toEqual('10:43');
    expect(formatTimeOmitHour((73 * 60) + (43))).toEqual('73:43');
  });
});