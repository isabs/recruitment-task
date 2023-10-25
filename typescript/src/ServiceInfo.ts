import { ServiceType } from ".";

export interface ServiceInfo {
  [year: number]: {
    base: { [service in ServiceType]: number };
    packages?: {
      itemsRequired: ServiceType[];
      discount: number;
    }[];
    discounts?: {
      item: ServiceType;
      discount: number;
      requiresOneOf: ServiceType[];
    }[];
  };
  services: {
    [service in ServiceType]: {
      requiresOneOf?: ServiceType[];
    };
  };
}

export const serviceInfo: ServiceInfo = {
  2020: {
    base: {
      Photography: 1700,
      VideoRecording: 1700,
      WeddingSession: 600,
      BlurayPackage: 300,
      TwoDayEvent: 400,
    },
    packages: [
      {
        itemsRequired: ["Photography", "VideoRecording"],
        discount: 1200,
      },
    ],
    discounts: [
      {
        item: "WeddingSession",
        discount: 300,
        requiresOneOf: ["Photography", "VideoRecording"],
      },
    ],
  },
  2021: {
    base: {
      Photography: 1800,
      VideoRecording: 1800,
      WeddingSession: 600,
      BlurayPackage: 300,
      TwoDayEvent: 400,
    },
    packages: [
      {
        itemsRequired: ["Photography", "VideoRecording"],
        discount: 1300,
      },
    ],
    discounts: [
      {
        item: "WeddingSession",
        discount: 300,
        requiresOneOf: ["Photography", "VideoRecording"],
      },
    ],
  },
  2022: {
    base: {
      Photography: 1900,
      VideoRecording: 1900,
      WeddingSession: 600,
      BlurayPackage: 300,
      TwoDayEvent: 400,
    },
    packages: [
      {
        itemsRequired: ["Photography", "VideoRecording"],
        discount: 1300,
      },
    ],
    discounts: [
      {
        item: "WeddingSession",
        discount: 600,
        requiresOneOf: ["Photography"],
      },
      {
        item: "WeddingSession",
        discount: 300,
        requiresOneOf: ["VideoRecording"],
      },
    ],
  },
  services: {
    Photography: {},
    VideoRecording: {},
    WeddingSession: {},
    BlurayPackage: {
      requiresOneOf: ["VideoRecording"],
    },
    TwoDayEvent: {
      requiresOneOf: ["Photography", "VideoRecording"],
    },
  },
};
