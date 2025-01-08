"use strict";

import * as vscode from "vscode";
import { GitExtension } from "./git";
import * as path from "path";

const gitExtension = vscode.extensions.getExtension<GitExtension>('vscode.git').exports;
const git = gitExtension.getAPI(1);
export function activate(context: vscode.ExtensionContext) {
  const disposableCreate = vscode.commands.registerCommand(
    "terminalRepo.create",
    () => {
      let uri = vscode.window.activeTextEditor?.document?.uri;
      if (!uri) return;
      let repo = git.getRepository(uri);
      if (!repo) return;
      let terminal = vscode.window.createTerminal({
        cwd: (repo.rootUri as vscode.Uri),
        name: path.basename(repo.rootUri.path)
      });
      terminal.show(false);
    }
  );

  const disposableOpen = vscode.commands.registerCommand(
    "terminalRepo.open",
    () => {
      let uri = vscode.window.activeTextEditor?.document?.uri;
      if (!uri) return;
      let repo = git.getRepository(uri);
      if (!repo) return;
      let terminal =
        vscode.window.terminals.find(
          (terminal) => terminal.name == path.basename(repo.rootUri.path)
        ) ||
        vscode.window.createTerminal({
          cwd: repo.rootUri.fsPath,
          name: path.basename(repo.rootUri.path)
        });
      terminal.show(false);
    }
  );
  context.subscriptions.push(disposableCreate, disposableOpen);
}

export function deactivate() { }
