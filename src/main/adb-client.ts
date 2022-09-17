import Adb, { DeviceClient } from '@devicefarmer/adbkit';

async function runCatching<T>(tag: string, fn: () => T): Promise<T | Error> {
  try {
    return await fn()
  } catch(err) {
    console.error(`${tag}: Something went wrong: `, err)
    return Promise.reject(err)
  }
}

/**
 * Client for interacting with adb
 */
export class AdbClient {
  private _device: DeviceClient | null = null
  private get device(): DeviceClient {
    if(!this._device) {
      throw new Error('Device has not been initialized!')
    }
    return this._device
  }

  /**
   * This must be called prior to any other methods in this class
   */
  async init() {
    await runCatching("init()", async () => {
      const client = Adb.createClient();
      const devices = await client.listDevices()

      if (devices.size === 0) {
        throw new Error('No devices available!')
      }

      console.log('getting device id: ', devices[0].id)
      this._device = await client.getDevice(devices[0].id)
      console.log('device has been set: ', this._device)
    });
  }

  /**
   * Execute a shell command
   */
  async shell(cmd: string): Promise<string> {
    console.log('exec(): ', cmd)
    return await runCatching("exec():", async () => {
      const result = await this.device.shell(cmd)
      const output = (await Adb.util.readAll(result)).toString().trim()
      console.log('%s', output);
      return output
    })
  }

  async getPackages(): Promise<string[]> {
    return await runCatching("getPackages()", async() => await this.device.getPackages())
  }

  async root(): Promise<void> {
    try {
      return await runCatching("root()", async() => await this.device.root())
    } catch(e) {
      console.warn('Error calling root: ', e)
    }
  }
}
