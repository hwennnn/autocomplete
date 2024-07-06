import { useEffect, useRef, useState } from "react";
import Autocomplete from "./components/Autocomplete";
import { Country, countryOptions, fruitOptions } from "./data";

const DebounceSearch = () => {
  const [formattedOptions, setFormattedOptions] = useState<string[]>([]);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Clean up timeout on component unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  const performSearch = (inputValue: string) => {
    setFormattedOptions(
      fruitOptions.filter((option) =>
        option.toLowerCase().includes(inputValue.toLowerCase())
      )
    );
    setIsLoading(false);
  };

  const onInputChange = (inputValue: string) => {
    setIsLoading(true);

    const debounce = (delay: number) => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        performSearch(inputValue);
        debounceTimeout.current = null;
      }, delay);
    };

    debounce(300);
  };

  return (
    <Autocomplete
      label="Debounce search"
      description="The results will only be shown after 300ms of cessation of typing."
      options={fruitOptions}
      multiple={true}
      loading={isLoading}
      filterOptions={() => formattedOptions}
      onInputChange={onInputChange}
    />
  );
};

const ControlledAutoComplete = () => {
  const [value, setValue] = useState<Country[]>([]);

  const onValueChange = (value: Country | Country[]) => {
    if (Array.isArray(value)) {
      setValue(value);
    } else {
      setValue([value]);
    }
  };

  // Note: Both value and onChange are required for controlled component
  return (
    <Autocomplete
      label="Controlled component + Custom render"
      options={countryOptions}
      value={value}
      multiple={true}
      onChange={onValueChange}
      description={
        "Selected values (controlled from parent): " + value.join(", ")
      }
      renderOption={(option, isSelected, onSelect) => {
        return (
          <div className="p-2 hover:bg-slate-300" onClick={onSelect}>
            {`${option.label} (${option.value})`}

            {isSelected ? " (Selected)" : ""}
          </div>
        );
      }}
    />
  );
};

const App: React.FC = () => {
  return (
    <div className="bg-gray-100 w-screen flex h-screen justify-center items-center flex-col shadow-xl">
      <div className="mb-4 space-y-4 flex-col bg-white p-8 rounded-md w-96">
        <h2 className="mb-2 text-lg">Autocomplete Component</h2>

        <Autocomplete
          label="Sync search"
          description="Single option selection"
          options={fruitOptions}
        />

        <Autocomplete
          label="Sync search"
          description="Custom Model + Multiple options selection"
          options={countryOptions}
          multiple={true}
        />

        <ControlledAutoComplete />

        <DebounceSearch />
      </div>
    </div>
  );
};

export default App;
