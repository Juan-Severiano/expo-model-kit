import * as React from 'react';

import { ExpoModelKitViewProps } from './ExpoModelKit.types';

export default function ExpoModelKitView(props: ExpoModelKitViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
