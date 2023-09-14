"use strict";

import * as vscode from "vscode";
import path = require("path");
import fs = require("fs");

const MAX_DEPTH = 10;

function findParentRepoPath(filePath: string) {
  let i = 0;
  let parent = path.dirname(filePath);
  while (i < MAX_DEPTH) {
    if (fs.existsSync(path.join(parent, ".git"))) {
      return parent;
    }
    parent = path.dirname(parent);
  }
  return path.dirname(filePath);
}

export function activate(context: vscode.ExtensionContext) {
  const disposableCreate = vscode.commands.registerCommand(
    "terminalRepo.create",
    () => {
      let uri = vscode.window.activeTextEditor?.document?.uri;
      if (!uri) return;
      let terminal = vscode.window.createTerminal({
        cwd: findParentRepoPath(uri.fsPath),
      });
      terminal.show(false);
    }
  );

  const disposableOpen = vscode.commands.registerCommand(
    "terminalRepo.open",
    () => {
      let uri = vscode.window.activeTextEditor?.document?.uri;
      if (!uri) return;
      const terminalPath = findParentRepoPath(uri.fsPath);
      let terminal =
        vscode.window.terminals.find(
          (terminal) => terminal.name == path.basename(terminalPath)
        ) ||
        vscode.window.createTerminal({
          cwd: terminalPath,
          name: path.basename(terminalPath),
        });
      terminal.show(false);
    }
  );

  context.subscriptions.push(disposableCreate, disposableOpen);
}

export function deactivate() {}
