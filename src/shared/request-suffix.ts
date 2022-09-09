import { Channels } from "main/preload";

const REQUEST_SUFFIX = 'response'

export function getResponseChannel(channel: Channels): string {
  return `${channel}_${REQUEST_SUFFIX}_${new Date().getTime()}`
}
