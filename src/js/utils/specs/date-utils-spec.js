// eslint-disable-next-line import/no-amd
define(
    [
        '../../utils/spec-helpers/spec-helpers.js',
        '../date-utils.js',
        'moment',
        'moment-timezone',
    ],
    function (
        SpecHelpers,
        DateUtils,
        moment,
        momentTZ,
    ) {
        'use strict';

        describe('DateUtils', function () {
            beforeEach(function () {
                setFixtures('<div class="test"></div>');
            });

            describe('stringToMoment', function () {
                it('returns an empty string if provided no time', function () {
                    expect(DateUtils.stringToMoment()).toEqual(undefined);
                });
                it('converts a string to a moment.js object', function () {
                    expect(
                        DateUtils.stringToMoment('2016-10-14 08:00:00+00:00').format('ll'),
                    ).toEqual('Oct 14, 2016');
                });
            });

            describe('getSysTimezone', function () {
                it('attempts to determine system timezone', function () {
                    // we need to determine the system tz offset from which to compare
                    var sysDate = new Date();
                    var sysDateOffset = sysDate.getTimezoneOffset();
                    var dateUtilOffset = momentTZ.tz.zone(DateUtils.getSysTimezone()).offset(sysDate);
                    expect(sysDateOffset).toEqual(dateUtilOffset);
                });
            });

            describe('localizeTime', function () {
                it('tests error conditions', function () {
                    expect(DateUtils.localizeTime()).toEqual('');
                });
                it('tests sys time determiner', function () {
                    var testDate = DateUtils.stringToMoment('2016-10-14 08:00:00+00:00');
                    expect(
                        moment(DateUtils.localizeTime(testDate).format()).isValid(),
                    ).toBeTruthy();
                });
                it('offsets time according to a determined timezone', function () {
                    var testDate = DateUtils.stringToMoment('2016-10-14 08:00:00+00:00');
                    // in order to avoid DST messes, we'll just pick some TZs without
                    var TestZones = {
                        'America/Winnipeg': 'Oct 14, 2016 3:00 AM',
                        'Pacific/Honolulu': 'Oct 13, 2016 10:00 PM',
                        'Asia/Ho_Chi_Minh': 'Oct 14, 2016 3:00 PM',
                        'Atlantic/Reykjavik': 'Oct 14, 2016 8:00 AM',
                        RANDOM_STRING: 'Oct 14, 2016 8:00 AM',
                    };
                    Object.keys(TestZones).forEach(function (key) {
                        expect(
                            // eslint-disable-next-line new-cap
                            new DateUtils.localizeTime(testDate, key).format('lll'),
                        ).toEqual(TestZones[key]);
                    });
                });
            });

            describe('localize', function () {
                it('tests error conditions', function () {
                    var context = {};
                    expect(
                        DateUtils.localize(context),
                    ).toEqual('');
                    context = {
                        datetime: 'RANDOM_STRING',
                        timezone: 'RANDOM_STRING',
                        language: 'RANDOM_STRING',
                    };
                    expect(DateUtils.localize(context)).toEqual('');
                });
                it('tests defaults', function () {
                    var context = {
                        datetime: '2016-10-14 08:00:00+00:00',
                        timezone: 'RANDOM_STRING',
                        language: 'RANDOM_STRING',
                    };
                    expect(DateUtils.localize(context)).toEqual('Oct 14, 2016 08:00 UTC');
                });

                it('generates a localized string based on a language preference', function () {
                    var TestLangs = {
                        en: 'Oct 14, 2016 08:00 UTC',
                        ru: '14 окт. 2016 г. 08:00 UTC',
                        ar: '١٤ أكتوبر ٢٠١٦ ٠٨:٠٠ UTC',
                    };
                    Object.keys(TestLangs).forEach(function (key) {
                        var context = {
                            datetime: '2016-10-14 08:00:00+00:00',
                            timezone: 'UTC',
                            language: key,
                        };
                        expect(DateUtils.localize(context)).toEqual(TestLangs[key]);
                    });
                });
                it('checks for formatting', function () {
                    var TestFormats = {
                        time: '8:00:00 AM UTC',
                        shortDate: 'Oct 14, 2016',
                        longDate: 'Friday, October 14, 2016 8:00 AM',
                        undefined: 'Oct 14, 2016 08:00 UTC',
                    };
                    Object.keys(TestFormats).forEach(function (key) {
                        var context = {
                            datetime: '2016-10-14 08:00:00+00:00',
                            timezone: 'UTC',
                            language: 'en',
                            format: DateUtils.dateFormatEnum[key],
                        };
                        expect(DateUtils.localize(context)).toEqual(TestFormats[key]);
                    });
                });

                it('generates a localized datetime string', function () {
                    var context = {
                        datetime: '2016-10-14 08:00:00+00:00',
                        timezone: 'Atlantic/Azores',
                    };
                    expect(DateUtils.localize(context)).toEqual('Oct 14, 2016 08:00 +00');
                });

                it('generates a more complex localized datetime string', function () {
                    var context = {
                        datetime: '2016-10-14 08:00:00+00:00',
                        timezone: 'Pacific/Kiritimati',
                        language: 'ar',
                        format: DateUtils.dateFormatEnum.longDate,
                    };
                    expect(
                        DateUtils.localize(context),
                    ).toEqual('الجمعة ١٤ أكتوبر ٢٠١٦ ٢٢:٠٠');
                });
            });
        });
    },
);
