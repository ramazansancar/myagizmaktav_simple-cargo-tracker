import tracking from "../index";

// Shipment Unified Cargo
tracking.dhl
  .unifiedDhl({
    dhl_api_key: "12313121231",
    trackingNumberArray: ["123123123123"],
  })
  .then((res) => console.log(res));

tracking.fedex.customerTracking({
  clientID: "123123123123",
  secretID: "123123123123",
  trackingNumberArray: ["123123123123"],
});
