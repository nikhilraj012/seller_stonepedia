import Select from "react-select";
import { selectCommonStyles, selectCommonTheme } from "./styles/select.config";
import useLocation from "../hooks/useLocation";

export const LocationSelector = ({
  country,
  state,
  city,
  onChange,
  disabled,
}) => {
  const { countries, states, cities } = useLocation(country, state);

  return (
    <>
      <div className="min-w-0">
        <label className="mb-0.5 font-medium text-xs">Country</label>
        <Select
          options={countries}
          value={country}
          onChange={(v) => onChange({ country: v, state: null, city: null })}
          styles={selectCommonStyles}
          theme={selectCommonTheme}
          placeholder="Country"
          className="text-xs"
          required
          isSearchable={true}
          isDisabled={disabled}
          formatOptionLabel={(option) => (
            <div className="flex items-center gap-2">
              <img src={option.flag} alt="" className="w-5 h-4" />
              <span className="truncate ">{option.label}</span>
            </div>
          )}
        />
      </div>
      <div className="min-w-0">
        <label className="mb-0.5 text-xs font-medium">State</label>
        <Select
          options={states}
          value={state}
          // isDisabled={!country}
          isDisabled={disabled || !country}
          onChange={(v) => onChange({ state: v, city: null })}
          styles={selectCommonStyles}
          theme={selectCommonTheme}
          placeholder="State"
          className="text-xs  "
          isSearchable={true}
          required
        />
      </div>
      <div className="min-w-0">
        <label className="mb-0.5 text-xs font-medium">City</label>
        <Select
          options={cities}
          value={city}
          // isDisabled={!state}
          isDisabled={disabled || !state}
          onChange={(v) => onChange({ city: v })}
          styles={selectCommonStyles}
          theme={selectCommonTheme}
          placeholder="City"
          className="text-xs"
          required
          isSearchable={true}
        />
      </div>
      {/* <div className="min-w-0">
                  <label className="mb-0.5 font-medium text-xs">Country</label>
                  <Select
                    options={countryOptions}
                    value={formData.country}
                    onChange={(value) => {
                      setFormData((prev) => ({
                        ...prev,
                        country: value,
                        state: null,
                        city: null,
                        phone: "",
                      }));
                    }}
                    placeholder="Country"
                    required
                    name="country"
                    className="text-xs  "
                    isSearchable={true}
                    styles={selectCommonStyles}
                    theme={selectCommonTheme}
                    formatOptionLabel={(option) => (
                      <div className="flex items-center gap-2">
                        <img src={option.flag} alt="" className="w-5 h-4" />
                        <span className="truncate ">{option.label}</span>
                      </div>
                    )}
                  />
                </div>
                <div className="min-w-0">
                  <label className="mb-0.5 text-xs font-medium">State</label>
                  <Select
                    options={stateOptions}
                    styles={selectCommonStyles}
                    theme={selectCommonTheme}
                    value={formData.state}
                    onChange={(value) => {
                      setFormData((prev) => ({
                        ...prev,
                        state: value,
                        city: null,
                      }));
                    }}
                    placeholder="State"
                    isDisabled={!formData.country}
                    required
                    name="state"
                    className="text-xs"
                  />
                </div>
                <div className="min-w-0">
                  <label className="mb-0.5 text-xs font-medium">City</label>
                  <Select
                    options={cityOptions}
                    value={formData.city}
                    styles={selectCommonStyles}
                    theme={selectCommonTheme}
                    onChange={(value) =>
                      setFormData({ ...formData, city: value })
                    }
                    placeholder="City"
                    isDisabled={!formData.state}
                    className="text-xs outline-none"
                    required
                    name="city"
                  />
                </div> */}
    </>
  );
};
