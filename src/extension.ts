import * as vscode from 'vscode';
import { getDelimitedText, getWrappedText, wrapAndDelimitText } from './lib/transform';

export function activate(context: vscode.ExtensionContext) {
    const configuration = vscode.workspace.getConfiguration('vs-delimiter');
    const delimiter = configuration.get<string>('delimiter', ',');
    const wrapper = configuration.get<string>('wrapper', '\'');

    registerCommand(context, 'vs-delimiter.delimit', text => getDelimitedText(text, delimiter));
    registerCommand(context, 'vs-delimiter.wrap', text => getWrappedText(text, wrapper));
    registerCommand(context, 'vs-delimiter.wrapanddelimit', text => wrapAndDelimitText(text, delimiter, wrapper));
}

export function deactivate(): void {}

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
