import * as assert from 'assert';
import * as vscode from 'vscode';
import { commandId, configKey } from '../../lib/constants';

const configurationTarget = vscode.ConfigurationTarget.Global;

suite('Extension Test Suite', () => {
    const configuration = vscode.workspace.getConfiguration('vs-delimiter');

    test('activates the extension', async () => {
        const extension = vscode.extensions.getExtension('morber11.vs-delimiter');
        assert.ok(extension, 'Extension not found');

        await extension.activate();
        assert.strictEqual(extension.isActive, true);
    });

    suiteSetup(async () => {
        await configuration.update(configKey.delimiter, ',', configurationTarget);
        await configuration.update(configKey.wrapper, "'", configurationTarget);
    });

    suiteTeardown(async () => {
        await configuration.update(configKey.delimiter, ',', configurationTarget);
        await configuration.update(configKey.wrapper, "'", configurationTarget);
    });

    test('registers all commands', async () => {
        const commands = await vscode.commands.getCommands(true);

        assert.ok(commands.includes(commandId.delimit));
        assert.ok(commands.includes(commandId.wrap));
        assert.ok(commands.includes(commandId.wrapAndDelimit));
    });

    test('delimit and wrap commands edit selected text', async () => {
        await configuration.update(configKey.delimiter, ',', configurationTarget);
        await configuration.update(configKey.wrapper, "'", configurationTarget);

        const delimiterDocument = await vscode.workspace.openTextDocument({ content: 'a b', language: 'plaintext' });
        const delimiterEditor = await vscode.window.showTextDocument(delimiterDocument);
        delimiterEditor.selection = new vscode.Selection(0, 0, 0, 3);

        await vscode.commands.executeCommand(commandId.delimit);
        assert.strictEqual(delimiterDocument.getText(), 'a, b');

        const wrapperDocument = await vscode.workspace.openTextDocument({ content: 'a b', language: 'plaintext' });
        const wrapperEditor = await vscode.window.showTextDocument(wrapperDocument);
        wrapperEditor.selection = new vscode.Selection(0, 0, 0, 3);

        await vscode.commands.executeCommand(commandId.wrap);
        assert.strictEqual(wrapperDocument.getText(), "'a' 'b'");
    });

    test('wrap and delimit edits multiple selections', async () => {
        await configuration.update(configKey.delimiter, ',', configurationTarget);
        await configuration.update(configKey.wrapper, "'", configurationTarget);

        const document = await vscode.workspace.openTextDocument({ content: 'a b\nc d', language: 'plaintext' });
        const editor = await vscode.window.showTextDocument(document);
        editor.selections = [
            new vscode.Selection(0, 0, 0, 3),
            new vscode.Selection(1, 0, 1, 3)
        ];

        await vscode.commands.executeCommand(commandId.wrapAndDelimit);

        assert.strictEqual(document.getText(), "'a', 'b'\n'c', 'd'");
    });

    test('uses updated configuration without reactivation', async () => {
        const document = await vscode.workspace.openTextDocument({ content: 'a b', language: 'plaintext' });
        const editor = await vscode.window.showTextDocument(document);

        await configuration.update(configKey.delimiter, ',', configurationTarget);
        editor.selection = new vscode.Selection(0, 0, 0, 3);

        await vscode.commands.executeCommand(commandId.delimit);
        assert.strictEqual(document.getText(), 'a, b');

        await configuration.update(configKey.delimiter, '|', configurationTarget);
        await configuration.update(configKey.wrapper, '"', configurationTarget);
        await editor.edit(editBuilder => editBuilder.replace(new vscode.Range(0, 0, 0, 4), 'c d'));

        editor.selection = new vscode.Selection(0, 0, 0, 3);
        await vscode.commands.executeCommand(commandId.wrapAndDelimit);

        assert.strictEqual(document.getText(), '"c"| "d"');
    });
});
