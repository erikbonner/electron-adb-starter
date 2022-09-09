import { contextBridge, ipcRenderer } from 'electron';
import { EmulatorRequest } from '../shared/emulator-request.enum';
import { getResponseChannel } from '../shared/request-suffix';

export type Channels = 'emulator-requests';

function sendWithResponse<T>(channel: Channels, ...args: unknown[]): Promise<T> {
  console.log('sendWithResponse(): ', { channel, args })
  const responseChannel = getResponseChannel(channel);
  ipcRenderer.send(channel, ...[...args, responseChannel])
  return new Promise<T>((resolve) => {
    ipcRenderer.once(responseChannel, (_event, ...args) => {
      console.log('sendWithResponse(): response arrived: ', args)
      resolve(args[0] as T)
    });
  })
}

contextBridge.exposeInMainWorld('electron', {
  listPackages(): Promise<string[]> {
    return sendWithResponse<string[]>('emulator-requests', EmulatorRequest.ListPackages)
  }
});
