import { StylesConfig } from 'react-select'
export const reactSelectStyles = {
  container: (styles: StylesConfig['container']) => ({
    ...styles,
    width: '100%',
  }),
  control: (styles: StylesConfig['control']) => ({
    ...styles,
    border: 'none',
    borderRadius: '0',
    padding: '0.5rem 0.5rem',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  }),
  indicatorSeparator: (styles: StylesConfig['indicatorSeparator']) => ({
    ...styles,
    display: 'none',
  }),
}
