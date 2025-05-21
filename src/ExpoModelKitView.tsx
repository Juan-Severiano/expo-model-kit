import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoModelKitViewProps } from './ExpoModelKit.types';

const NativeView: React.ComponentType<ExpoModelKitViewProps> =
  requireNativeView('ExpoModelKit');

export default function ExpoModelKitView(props: ExpoModelKitViewProps) {
  return <NativeView {...props} />;
}
