## Simple Cargo Tracking from DHL and Fedex

npm: https://www.npmjs.com/package/fedex-dhl-simple-cargo-tracker
Example: 
```

import tracking from "fedex-dhl-simple-cargo-tracker";

tracking
  .dhl({ dhl_api_key: "12313121231", trackingNumberArray: ["123123123123"] })
  .then((res) => console.log(res));


tracking.fedex({
  clientID: "123123123123",
  secretID: "123123123123",
  trackingNumberArray: ["123123123123"],
});
```