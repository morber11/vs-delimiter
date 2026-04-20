import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
    test('activates the extension', async () => {
        const extension = vscode.extensions.getExtension('morber11.vs-delimiter');
        assert.ok(extension, 'Extension not found');

        await extension.activate();
        assert.strictEqual(extension.isActive, true);
    });

    test('registers the commands without failing', async () => {
        await vscode.commands.executeCommand('vs-delimiter.delimit');
        await vscode.commands.executeCommand('vs-delimiter.wrap');
        await vscode.commands.executeCommand('vs-delimiter.wrapanddelimit');
    });
});