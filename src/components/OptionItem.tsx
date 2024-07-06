import { forwardRef, useId } from "react";

interface ItemProps {
  children: React.ReactNode;
  active: boolean;
  isSelected: boolean;
  isMultiple?: boolean;
}

const OptionItem = forwardRef<
  HTMLDivElement,
  ItemProps & React.HTMLProps<HTMLDivElement>
>(({ children, active, isMultiple, isSelected, ...rest }, ref) => {
  const id = useId();

  return (
    <div
      ref={ref}
      role="option"
      aria-selected={active}
      {...rest}
      className="flex-row justify-between flex items-center text-sm gap-2"
      style={{
        ...rest.style,
        background: active ? "lightblue" : "none",
        padding: 6,
        cursor: "default",
      }}
    >
      {children}

      {isMultiple === true && (
        <input
          readOnly={true}
          id={id}
          type="checkbox"
          checked={isSelected}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        />
      )}
    </div>
  );
});

export default OptionItem;
