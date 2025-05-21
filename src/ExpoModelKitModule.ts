import { NativeModule, requireNativeModule } from 'expo';

import { ExpoModelKitModuleEvents } from './ExpoModelKit.types';

declare class ExpoModelKitModule extends NativeModule<ExpoModelKitModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoModelKitModule>('ExpoModelKit');
