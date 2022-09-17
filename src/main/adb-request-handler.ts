import { WebContents } from "electron";
import { EmulatorRequest } from "../shared/emulator-request.enum";
import { AdbClient } from "./adb-client";
import { EnumRequestHandler } from "./enum-request-handler";
import { Channels } from "./preload";

/**
 * Responds to emulator requests from render thread
 */
export class AdbRequestHandler extends EnumRequestHandler<EmulatorRequest> {
  private readonly adbClient = new AdbClient()

  constructor(channel: Channels) {
    super(channel)
  }

  /**
   * Initializes internal adb client. Must be called before any events
   * are handled.
   */
  async init() {
    await this.adbClient.init()
  }

  protected handleEvent(sender: WebContents, eventType: EmulatorRequest, args: any[]): Promise<void> {
    console.log('AdbRequestHandler#handleEvent(): ', {eventType, args});
    switch(eventType) {
      case EmulatorRequest.ListPackages: {
        return this.listPackages(sender, this.getResponseChannelFromArgs(args))
      }
      case EmulatorRequest.Restart: {
        return this.restartAdb()
      }
      default: return Promise.reject(
        new Error('handleEvent(): No handler for eventType: ' + eventType)
      )
    }
  }

  private async listPackages(sender: WebContents, responseChannel: string) {
    const packages = await this.adbClient.getPackages()
    console.log('AdbRequestHandler#listPackages(): ', { responseChannel })
    this.sendResponse(sender, responseChannel, packages)
  }

  private async restartAdb(): Promise<void> {
    console.log('AdbRequestHandler#restartAdb()')
    await this.adbClient.root()
    await this.adbClient.shell('stop')
    await this.adbClient.shell('start')
  }
}
