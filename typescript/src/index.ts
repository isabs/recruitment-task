import { serviceInfo } from "./servicePrices";

export type ServiceYear = 2020 | 2021 | 2022;
export type ServiceType =
  | "Photography"
  | "VideoRecording"
  | "BlurayPackage"
  | "TwoDayEvent"
  | "WeddingSession";

export interface Price {
  basePrice: number;
  finalPrice: number;
}

export const updateSelectedServices = (
  previouslySelectedServices: ServiceType[],
  action: { type: "Select" | "Deselect"; service: ServiceType }
): ServiceType[] => {
  const { type, service } = action;

  if (type === "Select") {
    if (previouslySelectedServices.includes(service)) {
      return [...previouslySelectedServices];
    }
    if (
      serviceInfo.services[service].requiresOneOf != null &&
      !previouslySelectedServices.some((x) =>
        serviceInfo.services[service].requiresOneOf.includes(x)
      )
    ) {
      return [...previouslySelectedServices];
    }

    return [...previouslySelectedServices, service];
  }

  if (type === "Deselect") {
    const restOfServices = previouslySelectedServices.filter(
      (x) => x !== service
    );
    const invalidServices = restOfServices
      .map((x) => ({ item: x, services: serviceInfo.services[x] }))
      .filter(
        (x) =>
          x.services.requiresOneOf != null &&
          x.services.requiresOneOf.includes(service) &&
          !restOfServices.some((y) => x.services.requiresOneOf.includes(y))
      )
      .map((x) => x.item);

    if (invalidServices.length === 0) {
      return restOfServices;
    }

    return previouslySelectedServices
      .filter((x) => x !== service)
      .filter((x) => !invalidServices.includes(x));
  }

  return [...previouslySelectedServices];
};

export const calculatePrice = (
  selectedServices: ServiceType[],
  selectedYear: ServiceYear
): Price => {
  const yearPrices = serviceInfo[selectedYear];

  const basePrice = selectedServices
    .map((selectedService) => yearPrices.base[selectedService])
    .reduce((a, b) => a + b, 0);
  const discountsFromPackages = calculatePackages(
    selectedServices,
    selectedYear
  );
  const discountsFromDiscounts = calculateDiscounts(
    selectedServices,
    selectedYear
  );

  return {
    basePrice,
    finalPrice: basePrice - discountsFromPackages - discountsFromDiscounts,
  };
};

const calculatePackages = (
  selectedServices: ServiceType[],
  selectedYear: ServiceYear
): number => {
  const availablePackages =
    serviceInfo[selectedYear].packages?.sort((x) => x.discount)?.reverse() ||
    [];

  const notCalculatedPackages = new Set(selectedServices);
  let discount = 0;
  for (const packageInfo of availablePackages) {
    if (
      !packageInfo.itemsRequired.every((item) =>
        notCalculatedPackages.has(item)
      )
    ) {
      continue;
    }
    packageInfo.itemsRequired.forEach((x) => notCalculatedPackages.delete(x));
    discount += packageInfo.discount;
  }
  return discount;
};

const calculateDiscounts = (
  selectedServices: ServiceType[],
  selectedYear: ServiceYear
): number => {
  const availableDiscounts =
    serviceInfo[selectedYear].discounts?.sort((x) => x.discount)?.reverse() ||
    [];

  const notCalculatedDiscounts = new Set(selectedServices);
  let discount = 0;
  for (const discountInfo of availableDiscounts) {
    if (
      !notCalculatedDiscounts.has(discountInfo.item) ||
      !discountInfo.requiresOneOf.some((conditionalService) =>
        notCalculatedDiscounts.has(conditionalService)
      )
    ) {
      continue;
    }
    notCalculatedDiscounts.delete(discountInfo.item);
    discount += discountInfo.discount;
  }
  return discount;
};
