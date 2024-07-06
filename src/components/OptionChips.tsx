import { OptionType } from "./types";

interface OptionChipsProps<T extends OptionType> {
  values: T[];
  handleOptionSelect: (option: T) => void;
}

const OptionChips = <T extends OptionType>({
  values,
  handleOptionSelect,
}: OptionChipsProps<T>) => {
  return (
    <>
      {values.map((option, index) => (
        <div
          key={index}
          className="flex items-center bg-gray-100 rounded-full py-1 px-3 mr-2 mb-1"
        >
          <span className="mr-2 text-sm">
            {typeof option === "string" ? option : option.label}
          </span>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={(event) => {
              event.stopPropagation(); // To prevent the parent onClick from being triggered.
              handleOptionSelect(option);
            }}
          >
            ×
          </button>
        </div>
      ))}
    </>
  );
};

export default OptionChips;
