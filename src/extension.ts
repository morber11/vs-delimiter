import * as vscode from 'vscode';
import { getDelimitedText, getWrappedText, wrapAndDelimitText } from './lib/transform';
import { commandId, configKey } from './lib/constants';

export function activate(context: vscode.ExtensionContext) {
    registerCommand(context, commandId.delimit, text => {
        const delimiter = vscode.workspace.getConfiguration('vs-delimiter').get<string>(configKey.delimiter, ',');
        return getDelimitedText(text, delimiter);
    });

    registerCommand(context, commandId.wrap, text => {
        const wrapper = vscode.workspace.getConfiguration('vs-delimiter').get<string>(configKey.wrapper, '\'');
        return getWrappedText(text, wrapper);
    });

    registerCommand(context, commandId.wrapAndDelimit, text => {
        const config = vscode.workspace.getConfiguration('vs-delimiter');
        const delimiter = config.get<string>(configKey.delimiter, ',');
        const wrapper = config.get<string>(configKey.wrapper, '\'');
        return wrapAndDelimitText(text, delimiter, wrapper);
    });
}

export function deactivate(): void { }

function registerCommand(
    context: vscode.ExtensionContext,
    commandId: string,
    processFunction: (text: string) => string
) {
    const command = vscode.commands.registerCommand(commandId, async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        await editor.edit(editBuilder => {
            for (const selection of editor.selections) {
                const highlighted = editor.document.getText(selection);
                if (!highlighted) {
                    continue;
                }
                const processedText = processFunction(highlighted);
                editBuilder.replace(selection, processedText);
            }
        });
    });

    context.subscriptions.push(command);
}
