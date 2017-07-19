import * as test from 'tape';
import { globals } from './globals';
import { Uri } from '../src/uri';

const location = {
    origin: 'http://test-site',
    href: 'http://test-site/path/index.html'
};

test('Uri getAbsoluteUrl with absolute path expect same path', (t) => {
    globals({ location });

    const result = Uri.getAbsoluteUrl('http://other-site/other-path/image.jpg');

    t.equal(result, 'http://other-site/other-path/image.jpg');
    t.end();
});

test('Uri getAbsoluteUrl with relative to root path expect absolute path', (t) => {
    globals({ location });

    const result = Uri.getAbsoluteUrl('/other-path/image.jpg');

    t.equal(result, 'http://test-site/other-path/image.jpg');
    t.end();
});

test('Uri getAbsoluteUrl with relative to current path expect absolute path', (t) => {
    globals({ location });

    const result = Uri.getAbsoluteUrl('image.jpg');

    t.equal(result, 'http://test-site/path/image.jpg');
    t.end();
});
