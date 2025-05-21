import { registerWebModule, NativeModule } from 'expo';

import { ExpoModelKitModuleEvents } from './ExpoModelKit.types';

class ExpoModelKitModule extends NativeModule<ExpoModelKitModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoModelKitModule, 'ExpoModelKitModule');
