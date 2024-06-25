export type PortForwardCallback = (udid: string, systemPort: number, devicePort: number) => any;
export type PortReleaseCallback = (udid: string, systemPort: number) => any;
