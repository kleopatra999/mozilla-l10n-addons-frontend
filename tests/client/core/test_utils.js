import {
  camelCaseProps,
  convertBoolean,
  getClientApp,
  getClientConfig,
  isValidClientApp,
} from 'core/utils';

describe('camelCaseProps', () => {
  const input = {
    underscore_delimited: 'underscore',
    'hyphen-delimited': 'hyphen',
    'period.delimited': 'period',
  };

  const result = camelCaseProps(input);

  it('deals with hyphenated props', () => {
    assert.equal(result.hyphenDelimited, 'hyphen');
  });

  it('deals with underscore delimited props', () => {
    assert.equal(result.underscoreDelimited, 'underscore');
  });

  it('deals with period delimited props', () => {
    assert.equal(result.periodDelimited, 'period');
  });
});


describe('getClientConfig', () => {
  const fakeConfig = new Map();
  fakeConfig.set('hai', 'there');
  fakeConfig.set('what', 'evar');
  fakeConfig.set('secret', 'sauce');
  fakeConfig.set('clientConfigKeys', ['hai', 'what']);

  it('should add config data to object', () => {
    const clientConfig = getClientConfig(fakeConfig);
    assert.equal(clientConfig.hai, 'there');
    assert.equal(clientConfig.what, 'evar');
    assert.equal(clientConfig.secret, undefined);
  });
});


describe('convertBoolean', () => {
  it('should see "false" as false', () => {
    assert.equal(convertBoolean('false'), false);
  });

  it('should see "0" as false', () => {
    assert.equal(convertBoolean('0'), false);
  });

  it('should see 0 as false', () => {
    assert.equal(convertBoolean(0), false);
  });

  it('should get "true" as true', () => {
    assert.equal(convertBoolean('true'), true);
  });

  it('should get "1" as true', () => {
    assert.equal(convertBoolean('1'), true);
  });

  it('should get 1 as true', () => {
    assert.equal(convertBoolean(1), true);
  });

  it('should return true for true value', () => {
    assert.equal(convertBoolean(true), true);
  });

  it('should return false for random string value', () => {
    assert.equal(convertBoolean('whatevs'), false);
  });
});


describe('getClientApplication', () => {
  const androidWebkit = [
    dedent`'Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; LG-L160L Build/IML74K) AppleWebkit/534.30
      (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`,
    dedent`Mozilla/5.0 (Linux; U; Android 2.3.4; fr-fr; HTC Desire Build/GRJ22) AppleWebKit/533.1
      (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1`,
  ];

  const chromeAndroid = [
    dedent`Mozilla/5.0 (Linux; Android 4.1.1; Galaxy Nexus Build/JRO03C) AppleWebKit/535.19
      (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19`,
    dedent`Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76K) AppleWebKit/535.19
      (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19`,
    dedent`Mozilla/5.0 (Linux; Android 6.0.1; Nexus 6P Build/MMB29P) AppleWebKit/537.36
      (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36`,
  ];

  const chrome = [
    dedent`Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko)
      Chrome/41.0.2228.0 Safari/537.36`,
    dedent`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36
      (KHTML, like Gecko) Chrome/41.0.2227.1 Safari/537.36`,
  ];

  const firefox = [
    'Mozilla/5.0 (X11; Linux i686; rv:10.0) Gecko/20100101 Firefox/10.0',
    'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10; rv:33.0) Gecko/20100101 Firefox/33.0',
    'Mozilla/5.0 (X11; Linux i586; rv:31.0) Gecko/20100101 Firefox/31.0',
  ];

  const firefoxOS = [
    'Mozilla/5.0 (Mobile; rv:26.0) Gecko/26.0 Firefox/26.0',
    'Mozilla/5.0 (Tablet; rv:26.0) Gecko/26.0 Firefox/26.0',
    'Mozilla/5.0 (TV; rv:44.0) Gecko/44.0 Firefox/44.0',
    'Mozilla/5.0 (Mobile; nnnn; rv:26.0) Gecko/26.0 Firefox/26.0',
  ];

  const firefoxAndroid = [
    'Mozilla/5.0 (Android; Mobile; rv:40.0) Gecko/40.0 Firefox/40.0',
    'Mozilla/5.0 (Android; Tablet; rv:40.0) Gecko/40.0 Firefox/40.0',
    'Mozilla/5.0 (Android 4.4; Mobile; rv:41.0) Gecko/41.0 Firefox/41.0',
    'Mozilla/5.0 (Android 4.4; Tablet; rv:41.0) Gecko/41.0 Firefox/41.0',
  ];

  const firefoxIOS = [
    dedent`Mozilla/5.0 (iPod touch; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/600.1.4
      (KHTML, like Gecko) FxiOS/1.0 Mobile/12F69 Safari/600.1.4`,
    dedent`Mozilla/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/600.1.4
      (KHTML, like Gecko) FxiOS/1.0 Mobile/12F69 Safari/600.1.4`,
    dedent`Mozilla/5.0 (iPad; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/600.1.4
      (KHTML, like Gecko) FxiOS/1.0 Mobile/12F69 Safari/600.1.4`,
  ];

  it('should return firefox by default with no args', () => {
    assert.equal(getClientApp(), 'firefox');
  });

  it('should return firefox by default with bad type', () => {
    assert.equal(getClientApp(1), 'firefox');
  });

  for (const ua of androidWebkit) {
    it(`should return 'android' for a androidWebkit UA string ${ua}`, () => {
      assert.equal(getClientApp(ua), 'android');
    });
  }

  for (const ua of chromeAndroid) {
    it(`should return 'android' for a chromeAndroid UA string ${ua}`, () => {
      assert.equal(getClientApp(ua), 'android');
    });
  }

  for (const ua of chrome) {
    it(`should fallback to 'firefox' for a chrome UA string ${ua}`, () => {
      assert.equal(getClientApp(ua), 'firefox');
    });
  }

  for (const ua of firefox) {
    it(`should return firefox by default for a Firefox UA string ${ua}`, () => {
      assert.equal(getClientApp(ua), 'firefox');
    });
  }

  for (const ua of firefoxOS) {
    it(`should return firefox by default for a Firefox OS UA string ${ua}`, () => {
      assert.equal(getClientApp(ua), 'firefox');
    });
  }

  for (const ua of firefoxAndroid) {
    it(`should return android for a Firefox Android UA string ${ua}`, () => {
      assert.equal(getClientApp(ua), 'android');
    });
  }

  for (const ua of firefoxIOS) {
    it(`should return 'firefox' for a Firefox iOS UA string ${ua}`, () => {
      assert.equal(getClientApp(ua), 'firefox');
    });
  }

  it('should return "android" for a UA string that contains android not Android', () => {
    const ua = 'mozilla/5.0 (android; mobile; rv:40.0) gecko/40.0 firefox/40.0';
    assert.equal(getClientApp(ua), 'android');
  });
});


describe('isValidClientApp', () => {
  const _config = new Map();
  _config.set('validClientApplications', ['firefox', 'android']);

  it('should be valid if passed "firefox"', () => {
    assert.equal(isValidClientApp('firefox', { _config }), true);
  });

  it('should be valid if passed "android"', () => {
    assert.equal(isValidClientApp('android', { _config }), true);
  });

  it('should be invalid if passed "whatever"', () => {
    assert.equal(isValidClientApp('whatever', { _config }), false);
  });
});
