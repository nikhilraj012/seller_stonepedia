import { useMemo } from "react";
import {buildCountries, buildStates,buildCities } from "../utils/locationUtils";


const useLocation = (country, state) => {
  const countries = useMemo(() => buildCountries(), []);

  const states = useMemo(
    () => buildStates(country?.value),
    [country]
  );

  const cities = useMemo(
    () => buildCities(country?.value, state?.value),
    [country, state]
  );

  return { countries, states, cities };
};

export default useLocation;