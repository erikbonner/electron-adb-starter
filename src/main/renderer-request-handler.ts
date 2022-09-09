import { IpcMain } from "electron";

/**
 * Handles requests from renderer process.
 */
 export interface RendererRequestHandler {
  /**
   * Wire up IPC event handling for main process.
   */
  setupEventHandlers(ipc: IpcMain): void
}

