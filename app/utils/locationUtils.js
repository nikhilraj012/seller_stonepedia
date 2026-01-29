import { Country, State, City } from "country-state-city";

export const buildCountries = () =>
  Country.getAllCountries().map(c => ({
    label: c.name,
    value: c.isoCode,
    phonecode: c.phonecode,
    flag: `https://flagcdn.com/16x12/${c.isoCode.toLowerCase()}.png`,
  }));

export const buildStates = (countryCode) =>
  countryCode
    ? State.getStatesOfCountry(countryCode).map(s => ({
        label: s.name,
        value: s.isoCode,
      }))
    : [];

export const buildCities = (countryCode, stateCode) =>
  countryCode && stateCode
    ? City.getCitiesOfState(countryCode, stateCode).map(c => ({
        label: c.name,
        value: c.name,
      }))
    : [];