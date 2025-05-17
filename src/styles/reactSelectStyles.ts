import { StylesConfig } from 'react-select'
interface StateConfig {
  isOpen?: boolean
  isFocused?: boolean
  isSelected?: boolean
}
const ACCENT_COLOR = 'var(--accent-color)'

export const reactSelectStyles = {
  container: (styles: StylesConfig['container']) => ({
    ...styles,
    width: '100%',
  }),
  control: (styles: StylesConfig['control'], state: StateConfig) => ({
    ...styles,
    border: 'none',
    borderColor: state.isFocused ? ACCENT_COLOR : styles.borderColor,
    boxShadow: 'none',
    outline: '4px solid var(--accent-color)',
    outlineOffset: '-4px',
    borderRadius: '0',
    padding: '0.5rem 0.5rem',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  }),
  indicatorSeparator: (styles: StylesConfig['indicatorSeparator']) => ({
    ...styles,
    display: 'none',
  }),
  group: (styles: StylesConfig['group']) => ({
    ...styles,
    paddingBottom: '0',
    marginBottom: '0',
  }),
  groupHeading: (styles: StylesConfig['groupHeading']) => ({
    ...styles,
    backgroundColor: '#eee',
    margin: '0',
    padding: '0.5rem 0.5rem',
    fontWeight: 'bold',
  }),
  menu: (styles: StylesConfig['menu']) => ({
    ...styles,
    height: '100vh',
    maxHeight: '100vh',
    marginTop: '0',
    borderRadius: '0',
  }),
  menuList: (styles: StylesConfig['menuList']) => ({
    ...styles,
    padding: '0',
  }),
  option: (styles: StylesConfig['option'], state: StateConfig) => ({
    ...styles,
    padding: '0.5rem 0.5rem',
    backgroundColor: state.isSelected
      ? ACCENT_COLOR
      : state.isFocused
        ? `${ACCENT_COLOR}` // Slightly transparent on hover
        : undefined,
    color: state.isSelected ? 'black' : 'inherit',
    cursor: 'pointer',
  }),
}
