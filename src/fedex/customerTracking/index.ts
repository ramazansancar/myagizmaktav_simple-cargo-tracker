const getAuth = (clientID: string, secretID: string) => {
  // AUTH FOR FEDEX

  const config = {
    // config for api
    method: "post",

    // learn api pattern with header
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: `${clientID}`,
      client_secret: `${secretID}`,
    }),
  };

  return fetch(`https://apis-sandbox.fedex.com/oauth/token`, config) // post to data with fetch
    .then((response) => response.json()) // response data convert to object to js lang
    .then((res) => res["access_token"]); // than take it inside to acsees toekn object
};

/**
 *
 * @param trackingNumberArray [ "1234567890", "1234567890" ]
 * @param clientID From your authorization
 * @param secretID From your authorization
 * @returns FedexApiResponse[]
 * @brief This endpoint provides customers Package tracking information based on a tracking number for various shipping services.
 * @detail shorturl.at/nuCJU
 */
const customerTracking = async ({
  trackingNumberArray,
  clientID,
  secretID,
}: {
  trackingNumberArray: string[] | number[];
  clientID: string;
  secretID: string;
}) => {
  let array = [] as any;

  await trackingNumberArray.forEach((item) => {
    // for eacy array object
    array.push(
      // pushing ti this object [[{}],[{}]]
      {
        shipDateBegin: null,
        shipDateEnd: null,
        trackingNumberInfo: {
          trackingNumber: `${item}`,
          carrierCode: null,
          trackingNumberUniqueId: null,
        },
      }
    );
  });

  const splitArrayTo30Piece = () => {
    // CONVERT TO [[...30],[...30]]
    let arrayLength = array.length;
    let newArray = [];
    const chunkSize = 29;
    for (let i = 0; i < array.length; i += chunkSize) {
      // LEARN FOR
      const chunk = array.slice(i, i + chunkSize); // JS LEARN SLICE METHOD YOU WILL GET THAT
      newArray.push(chunk);
    }

    return newArray;
  };

  const newArray = splitArrayTo30Piece();
  const access_token = await getAuth(clientID, secretID);
  let result = [] as any;

  for (let index = 0; index < newArray.length; index++) {
    const config = {
      method: "post",

      headers: {
        authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
        "X-locale": "tr_TR",
      },
      body: JSON.stringify({
        includeDetailedScans: true,
        trackingInfo: [...newArray[index]],
      }),
    };

    await fetch(
      `https://apis-sandbox.fedex.com/track/v1/trackingnumbers`,
      config
    )
      .then((response) => response.json())
      .then((res) => {
        result = [...result, ...res.output.completeTrackResults]; // [insideDataResult,array]
      });
  }

  return result as FedexApiResponse[];
};

export default customerTracking;

export interface FedexApiResponse {
  transactionId: string;
  customerTransactionId: string;
  output: Output;
}

export interface Output {
  completeTrackResults: CompleteTrackResult[];
  alerts: string;
}

export interface CompleteTrackResult {
  trackingNumber: string;
  trackResults: TrackResult[];
}

export interface TrackResult {
  trackingNumberInfo: TrackingNumberInfo;
  additionalTrackingInfo: AdditionalTrackingInfo;
  distanceToDestination: DistanceToDestination;
  consolidationDetail: ConsolidationDetail[];
  meterNumber: string;
  returnDetail: ReturnDetail;
  serviceDetail: ServiceDetail;
  destinationLocation: Location;
  latestStatusDetail: LatestStatusDetail;
  serviceCommitMessage: ServiceCommitMessage;
  informationNotes: InformationNote[];
  error: Error;
  specialHandlings: SpecialHandling[];
  availableImages: AvailableImage[];
  deliveryDetails: DeliveryDetails;
  scanEvents: ScanEvent[];
  dateAndTimes: DateAndTime[];
  packageDetails: PackageDetails;
  goodsClassificationCode: string;
  holdAtLocation: Location;
  customDeliveryOptions: CustomDeliveryOption[];
  estimatedDeliveryTimeWindow: EstimatedDeliveryTimeWindowElement;
  pieceCounts: PieceCount[];
  originLocation: Location;
  recipientInformation: RecipientInformation;
  standardTransitTimeWindow: EstimatedDeliveryTimeWindowElement;
  shipmentDetails: ShipmentDetails;
  reasonDetail: ReasonDetail;
  availableNotifications: string[];
  shipperInformation: RecipientInformation;
  lastUpdatedDestinationAddress: LastUpdatedDestinationAddress;
}

export interface AdditionalTrackingInfo {
  hasAssociatedShipments: boolean;
  nickname: string;
  packageIdentifiers: PackageIdentifier[];
  shipmentNotes: string;
}

export interface PackageIdentifier {
  type: string;
  value: string;
  trackingNumberUniqueId: string;
}

export interface AvailableImage {
  size: string;
  type: string;
}

export interface ConsolidationDetail {
  timeStamp: string;
  consolidationID: string;
  reasonDetail: ReasonDetail;
  packageCount: number;
  eventType: string;
}

export interface ReasonDetail {
  description: string;
  type: string;
}

export interface CustomDeliveryOption {
  requestedAppointmentDetail: RequestedAppointmentDetail;
  description: string;
  type: string;
  status: string;
}

export interface RequestedAppointmentDetail {
  date: string;
  window: EstimatedDeliveryTimeWindowElement[];
}

export interface EstimatedDeliveryTimeWindowElement {
  description: string;
  window: EstimatedDeliveryTimeWindowWindow;
  type: string;
}

export interface EstimatedDeliveryTimeWindowWindow {
  begins: string;
  ends: string;
}

export interface DateAndTime {
  dateTime: string;
  type: string;
}

export interface DeliveryDetails {
  receivedByName: string;
  destinationServiceArea: string;
  destinationServiceAreaDescription: string;
  locationDescription: string;
  actualDeliveryAddress: LastUpdatedDestinationAddress;
  deliveryToday: boolean;
  locationType: string;
  signedByName: string;
  officeOrderDeliveryMethod: string;
  deliveryAttempts: string;
  deliveryOptionEligibilityDetails: DeliveryOptionEligibilityDetail[];
}

export interface LastUpdatedDestinationAddress {
  addressClassification: string;
  residential: boolean;
  streetLines: StreetLine[];
  city: string;
  urbanizationCode: string;
  stateOrProvinceCode: string;
  postalCode: string;
  countryCode: string;
  countryName: string;
}

export enum StreetLine {
  Suite999 = "Suite 999",
  The1043NorthEasyStreet = "1043 North Easy Street",
}

export interface DeliveryOptionEligibilityDetail {
  option: string;
  eligibility: string;
}

export interface Location {
  locationId: string;
  locationContactAndAddress: RecipientInformation;
  locationType: string;
}

export interface RecipientInformation {
  contact: Contact;
  address: LastUpdatedDestinationAddress;
}

export interface Contact {
  personName: string;
  phoneNumber: string;
  companyName: string;
}

export interface DistanceToDestination {
  units: string;
  value: number;
}

export interface Error {
  code: string;
  parameterList: ParameterList[];
  message: string;
}

export interface ParameterList {
  value: string;
  key: string;
}

export interface InformationNote {
  code: string;
  description: string;
}

export interface LatestStatusDetail {
  scanLocation: LastUpdatedDestinationAddress;
  code: string;
  derivedCode: string;
  ancillaryDetails: AncillaryDetail[];
  statusByLocale: string;
  description: string;
  delayDetail: DelayDetail;
}

export interface AncillaryDetail {
  reason: string;
  reasonDescription: string;
  action: string;
  actionDescription: string;
}

export interface DelayDetail {
  type: string;
  subType: string;
  status: string;
}

export interface PackageDetails {
  physicalPackagingType: string;
  sequenceNumber: string;
  undeliveredCount: string;
  packagingDescription: ReasonDetail;
  count: string;
  weightAndDimensions: WeightAndDimensions;
  packageContent: string[];
  contentPieceCount: string;
  declaredValue: DeclaredValue;
}

export interface DeclaredValue {
  currency: string;
  value: number;
}

export interface WeightAndDimensions {
  weight: Weight[];
  dimensions: Dimension[];
}

export interface Dimension {
  length: number;
  width: number;
  height: number;
  units: string;
}

export interface Weight {
  unit: string;
  value: string;
}

export interface PieceCount {
  count: string;
  description: string;
  type: string;
}

export interface ReturnDetail {
  authorizationName: string;
  reasonDetail: ReasonDetail[];
}

export interface ScanEvent {
  date: string;
  derivedStatus: string;
  scanLocation: LastUpdatedDestinationAddress;
  locationId: string;
  locationType: string;
  exceptionDescription: string;
  eventDescription: string;
  eventType: string;
  derivedStatusCode: string;
  exceptionCode: string;
  delayDetail: DelayDetail;
}

export interface ServiceCommitMessage {
  message: string;
  type: string;
}

export interface ServiceDetail {
  description: string;
  shortDescription: string;
  type: string;
}

export interface ShipmentDetails {
  contents: Content[];
  beforePossessionStatus: boolean;
  weight: Weight[];
  contentPieceCount: string;
  splitShipments: SplitShipment[];
}

export interface Content {
  itemNumber: string;
  receivedQuantity: string;
  description: string;
  partNumber: string;
}

export interface SplitShipment {
  pieceCount: string;
  statusDescription: string;
  timestamp: string;
  statusCode: string;
}

export interface SpecialHandling {
  description: string;
  type: string;
  paymentType: string;
}

export interface TrackingNumberInfo {
  trackingNumber: string;
  carrierCode: string;
  trackingNumberUniqueId: string;
}
