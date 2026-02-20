const vscode = require('vscode');

function activate(context) {


  const disposable = vscode.commands.registerCommand('runRevCommands', async () => {

    const editor = vscode.window.activeTextEditor;
    if (!editor) return;
    await vscode.commands.executeCommand('workbench.action.terminal.runSelectedText');

    if (editor.selection.isEmpty) {
      const pos = editor.selection.active;
      const doc = editor.document;

      // Find next executable line (non-empty, non-comment)
      let nextLine = pos.line + 1;
      while (nextLine < doc.lineCount) {
        const lineText = doc.lineAt(nextLine).text.trim();
        if (lineText.length > 0 && !lineText.startsWith('#')) {
          break;
        }
        nextLine++;
      }

      if (nextLine < doc.lineCount) {
        const nextLineLength = doc.lineAt(nextLine).text.length;
        const newPos = new vscode.Position(nextLine, nextLineLength);
        editor.selection = new vscode.Selection(newPos, newPos);
        editor.revealRange(new vscode.Range(newPos, newPos));
      }
    }
  });

  context.subscriptions.push(disposable);
}


module.exports = {
  activate
}