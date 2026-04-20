import * as assert from 'assert';
import { getDelimitedText, getWrappedText, wrapAndDelimitText } from '../../lib/transform';

suite('transform', () => {
    test('getDelimitedText adds delimiters between words', () => {
        assert.strictEqual(getDelimitedText('a b c', ','), 'a, b, c');
    });

    test('getDelimitedText preserves multiple spaces', () => {
        assert.strictEqual(getDelimitedText('a  b', ','), 'a,  b');
    });

    test('getDelimitedText preserves empty lines and multiline text', () => {
        assert.strictEqual(getDelimitedText('a b\nc d', ','), 'a, b\nc, d');
    });

    test('getWrappedText wraps each word and preserves spacing', () => {
        assert.strictEqual(getWrappedText("a  b", "'"), "'a'  'b'");
    });

    test('wrapAndDelimitText wraps and delimits text', () => {
        assert.strictEqual(wrapAndDelimitText('a b', ',', "'"), "'a', 'b'");
    });

    test('getDelimitedText preserves tabs and spaces', () => {
        assert.strictEqual(getDelimitedText('a\tb', ','), "a,\tb");
    });

    test('getWrappedText preserves tabs', () => {
        assert.strictEqual(getWrappedText('a\tb', '"'), '"a"\t"b"');
    });

    test('getDelimitedText preserves trailing spaces on a line', () => {
        assert.strictEqual(getDelimitedText('a b ', ','), 'a, b ');
    });

    test('empty input returns empty string', () => {
        assert.strictEqual(getDelimitedText('', ','), '');
        assert.strictEqual(getWrappedText('', "'"), '');
        assert.strictEqual(wrapAndDelimitText('', ',', "'"), '');
    });
});
