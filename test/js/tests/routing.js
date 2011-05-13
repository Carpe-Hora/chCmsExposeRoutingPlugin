test('api definition', function() {
  expect(5);

  ok(Routing, 'Routing is defined');
  ok($.isFunction(Routing.connect), 'Routing.connect is a function');
  ok($.isFunction(Routing.generate), 'Routing.generate is a function');
  ok($.isFunction(Routing.get), 'Routing.get is a function');
  ok($.isFunction(Routing.has), 'Routing.has is a function');
});

test('route registration', function() {
  expect(9);

  strictEqual(Routing.connect('route_1', '/route1'), Routing,
              'connect "route_1". Routing.connect returns Routing');
  ok(Routing.has('route_1'), 'route_1 is connected');
  ok(!Routing.has('route_2'), 'route_2 is not yet connected');
  equal(Routing.get('route_1'), '/route1', 'route_1 url is correct');

  strictEqual(Routing.connect('route_2', '/route2'), Routing,
              'connect "route_2". Routing.connect returns Routing');
  ok(Routing.has('route_1'), 'route_1 is still connected');
  ok(Routing.has('route_2'), 'route_2 is connected');
  equal(Routing.get('route_1'), '/route1', 'route_1 url is still correct');
  equal(Routing.get('route_2'), '/route2', 'route_2 url is correct');
});

test('route generation', function() {
  expect(10);

  equal(Routing.connect('route_1', '/route1').generate('route_1'), '/route1',
                              'generating url without parameters returns url');

  equal(Routing.generate('route_1', { foo: 'bar' }), '/route1?foo=bar',
                        'passing extra parameters happens it as query string');

  equal(Routing.connect('route_1', '/route1?a=b')
                              .generate('route_1', { foo: 'bar' }),
                              '/route1?a=b&foo=bar',
                              'query string is extended if already started');

  equal(Routing.connect('route_1', '/route/:id/edit')
                              .generate('route_1', { id: 'bar' }),
                              '/route/bar/edit',
                              'basic parameter replacement is ok');

  equal(Routing.connect('route_1', '/route/:id')
                              .generate('route_1', { id: 'bar' }),
                              '/route/bar',
                              'end of string parameter replacement is ok');

  equal(Routing.generate('route_1', { id: 'foo', foo: 'bar' }),
                              '/route/foo?foo=bar',
                        'passing extra parameters happens it as query string');

  equal(Routing.connect('route_1', '/route/:identical/id/:id/id/:identical/foo')
                              .generate('route_1', { id: 'bar' }),
                              '/route/:identical/id/bar/id/:identical/foo',
                              'only exact variable matches.');

  equal(Routing.connect('route_1', ':id')
                              .generate('route_1', { id: 'bar' }),
                              '/bar',
                              'replacement without separator is ok');

  // check for prefix
  Routing.prefix = '/baz/';
  equal(Routing.connect('route_1', ':id')
                              .generate('route_1', { id: 'bar' }),
                              '/baz/bar',
                              'prefix is added');
  Routing.prefix = 'baz';
  equal(Routing.connect('route_1', ':id')
                              .generate('route_1', { id: 'bar' }),
                              '/baz/bar',
                              'prefix is surrounded by slashes');
});
