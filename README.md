# Autocomplete Component

A simple autocomplete component built with React and TypeScript.

## Props

The `Autocomplete` component accepts the following props:

| Name            | Type(s)                                                    | Description                                                                 |
|-----------------|---------------------------------------------------------|-----------------------------------------------------------------------------|
| `description`   | `string`                                                | Description or additional information to display below the component.               |
| `disabled`      | `boolean`                                               | Disables the component from any interaction if `true`.                                        |
| `filterOptions` | `(options: T[], inputValue: string) => T[]`              | Function to filter options based on the input value. <br/><br/> Note: By default, options are filtered using a simple string equality comparison on the label.                        |
| `label`         | `string`                                                | Label  to display above the component.                                        |
| `loading`       | `boolean`                                               | Shows a loading indicator if `true`.                                         |
| `multiple`      | `boolean`                                               | Allows multiple selections if `true`.                                        |
| `value`         | `T \| T[]`                                                | (Controlled) The selected value or an array of selected values. <br/><br/> Note: It must be used with `onChange` for controlled behavior.           |
| `onChange`      | `(value: T \| T[]) => void`                               | (Controlled) Callback function invoked when the value changes.    <br/><br/> Note: It must be used with `value` for controlled behavior.            |
| `onInputChange` | `(inputValue: string) => void`                           | Callback function invoked when the input value changes.                      |
| `options`       | `T[]`                                                   | An array of options to be displayed and selected.  <br/><br/> Note: T either can be either a `string` or an object (with a compulsory `label` field).                                   |
| `placeholder`   | `string`                                                | Placeholder text displayed when no option is selected.                       |
| `renderOption`  | `(option: T, isSelected: boolean, onSelect: () => void) => JSX.Element` | Custom renderer for each option in the dropdown.      <br/><br/> Note: `isSelected` indicates if the option is currently selected. `onSelect` is a callback function when the item is selected.                   |

**Note:** The `options` prop is mandatory.

## Considerations

These are some considerations made when making this component, so minimal changes are needed to be made with the given props.

### Controlled vs Uncontrolled

The `value` and `onChange` props are enforced to be used together to make the component controlled (and to prevent any unforeseen client-side bugs as well). This ensures that the parent component has full control over the value(s) of the component.

Similarly, if the `value` and `onChange` props are not provided, the component will be uncontrolled and will manage its own state internally.

### Mandatory `label` field for the `Object`

Currently, the object must include a `label` field. This is used by the `Autocomplete` component for displaying options and filtering. Future versions may include a `renderLabel` prop for more flexibility so the `label` field will be no longer mandatory.

### String comparison check

By default, options are filtered using a simple string equality comparison on the option’s label.

## Getting Started

To get started with this project, follow these steps:

### Installation

Clone the repository and install dependencies using Yarn:

```sh
git clone https://github.com/hwennnn/autocomplete

cd autocomplete

yarn
```

### Development

To run the development server:

```sh
yarn dev
```

This command starts Vite's development server and opens your project in the default browser.

### Building

To build the project for production:

```sh
yarn build
```

This will compile TypeScript files and bundle your application using Vite.

### Preview

To preview the production build locally:

```sh
yarn preview
```

This command serves the production build using Vite.

## Dependencies

- React
- TypeScript
- Vite
- Floating UI (@floating-ui/react)
