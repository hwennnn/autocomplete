import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingPortal,
  size,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
} from "@floating-ui/react";
import { ChangeEvent, useMemo, useRef, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import OptionChips from "./OptionChips";
import OptionItem from "./OptionItem";
import { OptionType } from "./types";

// Define a type for props when `value` and `onChange` are both present, for controlled components
interface ControlledValueProps<T extends OptionType> {
  value: T | T[];
  onChange: (value: T | T[]) => void;
}

// Define a type for props when `value` and `onChange` are both absent, for uncontrolled components
interface UncontrolledValueProps {
  value?: never;
  onChange?: never;
}

type AutocompleteProps<T extends OptionType> = (
  | ControlledValueProps<T>
  | UncontrolledValueProps
) & {
  description?: string;
  disabled?: boolean;
  filterOptions?: (options: T[], inputValue: string) => T[];
  label?: string;
  loading?: boolean;
  multiple?: boolean;
  onInputChange?: (inputValue: string) => void;
  options: T[]; // The only compulsory field
  placeholder?: string;
  renderOption?: (
    option: T,
    isActive: boolean,
    isSelected: boolean
  ) => JSX.Element;
};

const Autocomplete = <T extends OptionType>({
  description,
  disabled = false,
  filterOptions,
  label,
  loading = false,
  multiple = false,
  onChange: onValueChange, // rename for better readability
  onInputChange,
  options,
  placeholder,
  renderOption,
  value: valueFromProps, // rename for better readability
}: AutocompleteProps<T>) => {
  // the value will be controlled by props if both value and onChange are present
  const isValueControlled =
    valueFromProps !== undefined && onValueChange !== undefined;

  const [inputValue, setInputValue] = useState(""); // local state for input value
  const [isOpen, setIsOpen] = useState(false); // local state for dropdown visibility

  // internal state for uncontrolled component, only used when `value` and `onChange` are both absent
  const [selectedValues, setSelectedValues] = useState<T | T[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null); // index of the active option

  const currentSelectedValues = isValueControlled
    ? valueFromProps
    : selectedValues;

  const listRef = useRef<Array<HTMLElement | null>>([]);

  const { refs, floatingStyles, context } = useFloating<HTMLInputElement>({
    whileElementsMounted: autoUpdate,
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      flip({ padding: 10 }),
      size({
        apply({ rects, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${availableHeight}px`,
          });
        },
        padding: 10,
      }),
    ],
  });

  const role = useRole(context, { role: "listbox" });
  const dismiss = useDismiss(context, {
    escapeKey: true,
  });
  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    virtual: true,
    loop: true,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [role, dismiss, listNav]
  );

  // Only rebuild the filteredOptions when the filterOptions or inputValue changes
  const filteredOptions = useMemo(() => {
    return filterOptions !== undefined
      ? filterOptions(options, inputValue)
      : options.filter((option) =>
          (typeof option === "string"
            ? option.toLowerCase()
            : option.label.toLowerCase()
          ).includes(inputValue.toLowerCase())
        );
  }, [filterOptions, inputValue, options]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setInputValue(value);

    if (value) {
      setIsOpen(true);
      setActiveIndex(0);
    } else {
      setActiveIndex(null);
    }

    // callback to parent prop
    onInputChange && onInputChange(value);
  };

  const handleOptionSelect = (option: T) => {
    const isOptionSelected = isSelected(option);
    // option(string) or option.label is used to determine whether the option is selected.
    const optionValue = typeof option === "string" ? option : option.label;

    if (multiple) {
      const previousValue = Array.isArray(currentSelectedValues)
        ? currentSelectedValues
        : [currentSelectedValues]; // Convert to array if it's not already an array

      const newValue = isOptionSelected
        ? previousValue.filter((val) => {
            if (typeof val === "string") {
              return val !== option;
            } else {
              return val.label !== optionValue;
            }
          })
        : [...previousValue, option];

      // either callback to the parent prop or set the local selected values
      isValueControlled ? onValueChange(newValue) : setSelectedValues(newValue);
    } else {
      // either callback to the parent prop or set the local selected values
      isValueControlled ? onValueChange(option) : setSelectedValues(option);

      // Directly set the input value to the selected option
      setInputValue(optionValue);

      // callback to parent prop
      onInputChange && onInputChange(optionValue);
      setIsOpen(false);
    }
  };

  const isSelected = (option: T): boolean => {
    // option(string) or option.label is used to determine whether the option is selected.
    const optionValue = typeof option === "string" ? option : option.label;

    return !Array.isArray(currentSelectedValues)
      ? currentSelectedValues === optionValue
      : currentSelectedValues.findIndex((v) => {
          if (typeof v === "string") {
            return v === optionValue;
          } else {
            return v.label === optionValue;
          }
        }) !== -1;
  };

  return (
    <div className="w-full flex flex-col">
      {label && <label className="block mb-2 font-medium">{label}</label>}

      <div
        className={`flex flex-col border-2 p-1 rounded-lg bg-white ${
          isOpen ? "border-blue-500" : ""
        }`}
        aria-disabled={disabled}
        onClick={() => {
          if (disabled) return;

          setIsOpen(true);
          refs.domReference.current?.focus(); // Focus on the input field
        }}
      >
        <div className="flex flex-wrap">
          {
            // Display selected values in a "chip" format
            multiple && Array.isArray(currentSelectedValues) && (
              <OptionChips
                handleOptionSelect={handleOptionSelect}
                values={currentSelectedValues}
              />
            )
          }
        </div>

        <div className="flex justify-between items-center flex-1 w-full">
          <input
            {...getReferenceProps({
              disabled,
              "aria-disabled": disabled,
              ref: refs.setReference,
              type: "text",
              onChange: handleInputChange,
              value: inputValue,
              placeholder: placeholder ?? "Type to begin searching",
              "aria-autocomplete": "list",
              onMouseDown: () => {
                setIsOpen(true);
              },
              onKeyDown: (event) => {
                if (
                  event.key === "Enter" &&
                  activeIndex != null &&
                  filteredOptions[activeIndex]
                ) {
                  handleOptionSelect(filteredOptions[activeIndex]);
                  if (!multiple) {
                    setActiveIndex(null);
                    setIsOpen(false);
                  }
                }
              },
            })}
            className="flex-1 border-none outline-none p-1 text-sm"
          />

          {loading && <LoadingSpinner />}
        </div>
      </div>

      {description && (
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      )}

      {isOpen && !loading && (
        <FloatingPortal>
          <FloatingFocusManager
            context={context}
            initialFocus={-1}
            visuallyHiddenDismiss
          >
            <div
              {...getFloatingProps({
                ref: refs.setFloating,
                style: {
                  ...floatingStyles,
                },
              })}
              className="bg-gray-100 text-black overflow-y-auto mt-2 border-none"
            >
              {filteredOptions.length === 0 && (
                <p className="p-4">No results found.</p>
              )}

              <div className="max-h-72 flex flex-col">
                {filteredOptions.map((item, index) => {
                  const isItemSelected = isSelected(item);
                  const isActive = index === activeIndex;

                  const onSelect = () => {
                    handleOptionSelect(item);
                    if (!multiple) {
                      setIsOpen(false);
                    }

                    refs.domReference.current?.focus(); // Focus on the input field
                  };

                  return renderOption ? (
                    <div
                      {...getItemProps({
                        ref: (node) => {
                          listRef.current[index] = node;
                        },
                        onClick: onSelect,
                      })}
                    >
                      {renderOption(item, isActive, isItemSelected)}
                    </div>
                  ) : (
                    <OptionItem
                      {...getItemProps({
                        ref: (node) => {
                          listRef.current[index] = node;
                        },
                        onClick: onSelect,
                      })}
                      key={index}
                      isActive={isActive}
                      isMultiple={multiple}
                      isSelected={isItemSelected}
                    >
                      <p className="flex-1">
                        {typeof item === "string" ? item : item.label}
                      </p>
                    </OptionItem>
                  );
                })}
              </div>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </div>
  );
};

export default Autocomplete;
