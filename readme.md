## Simple Cargo Tracking from DHL and Fedex

npm: https://www.npmjs.com/package/simple-cargo-tracker
Example: 
```js

import tracking from "simple-cargo-tracker";

// Shipment Unified Cargo
tracking
  .dhl({ dhl_api_key: "12313121231", trackingNumberArray: ["123123123123"] })
  .then((res) => console.log(res));

// Tracking personal cargo packages
tracking.fedex.customerTracking({
  clientID: "123123123123",
  secretID: "123123123123",
  trackingNumberArray: ["123123123123"],
});
```