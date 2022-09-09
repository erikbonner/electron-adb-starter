declare global {
  interface Window {
    electron: {
      listPackages(): Promise<string[]>;
    };
  }
}

export {};
