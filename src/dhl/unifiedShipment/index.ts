const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

/**
 *
 * @param trackingNumberArray [ "1234567890", "1234567890" ]
 *  @param dhl_api_key From your authorization for your app
 * @returns DhlApiResponse[]
 *
 */
const unifiedDhl = async ({
  dhl_api_key,
  trackingNumberArray,
}: {
  dhl_api_key: string;
  trackingNumberArray: string[] | number[];
}) => {
  let result: any = [];

  for (let index = 0; index < trackingNumberArray.length; index++) {
    const config = {
      method: "get",

      headers: {
        "Content-Type": "application/json",
        "DHL-API-Key": `${dhl_api_key}`,
      },
    };

    await delay(500);
    await fetch(
      `https://api-eu.dhl.com/track/shipments?trackingNumber=${trackingNumberArray[index]}`,
      config
    )
      .then((response) => response.json())
      .then((res) => (result = [...result, res]));
  }
  return result as DhlApiResponse[];
};

export default unifiedDhl;
export interface DhlApiResponse {
  url: string;
  prevUrl: string;
  nextUrl: string;
  firstUrl: string;
  lastUrl: string;
  shipments: Shipment[];
  possibleAdditionalShipmentsUrl: string[];
}

export interface Shipment {
  id: string;
  service: string;
  origin: Destination;
  destination: Destination;
  status: Status;
  estimatedTimeOfDelivery: string;
  estimatedDeliveryTimeFrame: EstimatedDeliveryTimeFrame;
  estimatedTimeOfDeliveryRemark: string;
  serviceUrl: string;
  rerouteUrl: string;
  details: Details;
  events: Status[];
}

export interface Destination {
  address: Address;
}

export interface Address {
  countryCode: string;
  postalCode: string;
  addressLocality: string;
}

export interface Details {
  carrier: Carrier;
  product: Product;
  provider: Provider;
  receiver: Receiver;
  sender: Receiver;
  proofOfDelivery: ProofOfDelivery;
  totalNumberOfPieces: number;
  pieceIds: string[];
  weight: Weight;
  volume: Volume;
  loadingMeters: number;
  dimensions: Dimensions;
  references: References;
  "dgf:routes": DgfRoute[];
}

export interface Carrier {
  "@type": string;
  organizationName: string;
}

export interface DgfRoute {
  "dgf:vesselName": string;
  "dgf:voyageFlightNumber": string;
  "dgf:airportOfDeparture": DgfAirportOfDe;
  "dgf:airportOfDestination": DgfAirportOfDe;
  "dgf:estimatedDepartureDate": string;
  "dgf:estimatedArrivalDate": string;
  "dgf:placeOfAcceptance": DgfP;
  "dgf:portOfLoading": DgfP;
  "dgf:portOfUnloading": DgfP;
  "dgf:placeOfDelivery": DgfP;
}

export interface DgfAirportOfDe {
  "dgf:locationName": string;
  "dgf:locationCode": string;
  countryCode: string;
}

export interface DgfP {
  "dgf:locationName": string;
}

export interface Dimensions {
  width: Weight;
  height: Weight;
  length: Weight;
}

export interface Weight {
  value: number;
  unitText: string;
}

export interface Product {
  productName: string;
}

export interface ProofOfDelivery {
  timestamp: string;
  signatureUrl: string;
  documentUrl: string;
  signed: Receiver;
}

export interface Receiver {
  "@type": string;
  familyName: string;
  givenName: string;
  name: string;
  organizationName?: string;
}

export interface Provider {
  destinationProvider: string;
}

export interface References {
  number: string;
  type: string;
}

export interface Volume {
  value: number;
}

export interface EstimatedDeliveryTimeFrame {
  estimatedFrom: string;
  estimatedThrough: string;
}

export interface Status {
  timestamp: string;
  location: Destination;
  statusCode: string;
  status: string;
  description: string;
  pieceIds: string[];
  remark: string;
  nextSteps: string;
}
