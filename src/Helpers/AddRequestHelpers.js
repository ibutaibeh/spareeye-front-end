export const CAR_TYPES = ["Sedan", "SUV", "Hatchback", "Pickup", "Coupe", "Van"];

export const MAKES_BY_TYPE = {
  Sedan: ["Toyota", "Kia", "Hyundai", "Nissan", "Honda", "BMW", "Mercedes-Benz", "Audi"],
  SUV: ["Toyota", "Kia", "Hyundai", "Nissan", "Honda", "Chevrolet", "Jeep", "BMW", "Mercedes-Benz"],
  Hatchback: ["Toyota", "Kia", "Hyundai", "Nissan", "Volkswagen", "Ford"],
  Pickup: ["Toyota", "Nissan", "Ford", "Chevrolet", "Isuzu"],
  Coupe: ["BMW", "Mercedes-Benz", "Audi", "Toyota"],
  Van: ["Toyota", "Kia", "Hyundai", "Nissan"],
};

export const MODELS = {
  Toyota: {
    Sedan: ["Corolla", "Camry", "Yaris"],
    SUV: ["RAV4", "Prado", "Land Cruiser"],
    Hatchback: ["Yaris", "Corolla Hatchback"],
    Pickup: ["Hilux", "Tundra"],
    Coupe: ["GR86", "Supra"],
    Van: ["Hiace"],
  },
  Kia: {
    Sedan: ["Cerato (Forte)", "K5 (Optima)", "Rio", "Stinger"],
    SUV: ["Sportage", "Sorento", "Telluride"],
    Hatchback: ["Rio Hatchback"],
    Van: ["Carnival"],
  },
  Hyundai: {
    Sedan: ["Elantra", "Sonata", "Accent"],
    SUV: ["Tucson", "Santa Fe", "Palisade"],
    Hatchback: ["i30"],
    Van: ["H-1 (Starex)"],
  },
  Nissan: {
    Sedan: ["Sunny", "Altima", "Maxima"],
    SUV: ["X-Trail", "Patrol"],
    Hatchback: ["Micra"],
    Pickup: ["Navara"],
    Van: ["Urvan"],
  },
  Honda: { Sedan: ["Civic", "Accord"], SUV: ["CR-V", "Pilot"] },
  BMW: { Sedan: ["3 Series", "5 Series"], SUV: ["X3", "X5"], Coupe: ["4 Series", "2 Series"] },
  "Mercedes-Benz": { Sedan: ["C-Class", "E-Class"], SUV: ["GLC", "GLE"], Coupe: ["C-Class Coupe", "E-Class Coupe"] },
  Chevrolet: { SUV: ["Tahoe", "Traverse"], Pickup: ["Silverado"], Hatchback: ["Spark"] },
  Jeep: { SUV: ["Wrangler", "Grand Cherokee", "Compass"] },
  Volkswagen: { Hatchback: ["Golf", "Polo"] },
  Ford: { Hatchback: ["Focus"], Pickup: ["Ranger", "F-150"] },
  Isuzu: { Pickup: ["D-Max"] },
  Audi: { Coupe: ["A5 Coupe", "TT"] },
};

export function makeYears(start = 2000) {
  const end = new Date().getFullYear();
  const arr = [];
  for (let y = start; y <= end; y++) arr.push(String(y));
  return arr;
}

export function looksLikeProduct(url) {
  return typeof url === "string" && /product|item|part|sku|dp|pid/i.test(url);
}

export function makeLinkLabel(url) {
  try {
    const u = new URL(url);
    const segs = u.pathname.split("/").filter(Boolean);
    return segs[segs.length - 1] || u.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}