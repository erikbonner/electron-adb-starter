import { IpcMain, IpcMainEvent, WebContents } from "electron";
import { Channels } from "./preload";
import { RendererRequestHandler } from "./renderer-request-handler";

/**
 * Base class for handling IPC requests that are identified by an enum.
 */
export abstract class EnumRequestHandler<T> implements RendererRequestHandler {
  /**
   * Constructor.
   * @param channel channel through which IPC communication with this handler is done.
   */
  protected constructor(private readonly channel: Channels) {}

  /**
   * Wire up all IPC request handling for this handler.
   * Requests will be handled that are identified by the channel
   * passed to constructor, together with an enum key from type T.
   */
  setupEventHandlers(ipc: IpcMain): void {
    ipc.on(this.channel, (event: IpcMainEvent, ...args: any[]) => {
      console.log('EnumRequestHandler#ipc#on(): ', args)
      if (args.length === 0) {
        console.error('Event type not provided, not handling')
        return;
      }
      const eventType = args[0] as T
      this.handleEvent(event.sender, eventType, args.slice(1))
    })
  }

  protected getResponseChannelFromArgs(args: any[]): string {
    if (args.length === 0) {
      throw new Error('EnumRequestHandler#getReturnChannel(): args empty')
    }
    return args[args.length - 1]
  }

  /**
   * Children implement this for their domain-specific event handling.
   * @param sender the sender from which the event originated.
   * @param eventType identifies the event.
   * @param args optional event parameters
   */
  protected abstract handleEvent(sender: WebContents, eventType: T, args: any[]): Promise<void>

  protected sendResponse(target: WebContents, channel: string, args: any[]) {
    console.log('EnumRequestHandler#sendResponse(): ', channel)
    target.send(channel, args);
  }
}
