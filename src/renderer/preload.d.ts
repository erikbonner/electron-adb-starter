declare global {
  interface Window {
    electron: {
      listPackages(): Promise<string[]>;
      restart(): void;
    };
  }
}

export {};
