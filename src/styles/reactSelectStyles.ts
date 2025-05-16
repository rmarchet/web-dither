export const reactSelectStyles = {
  container: (styles: any) => ({
    ...styles,
    width: '100%',
  }),
  control: (styles: any) => ({
    ...styles,
    border: 'none',
    borderRadius: '0',
    padding: '0.5rem 0.5rem',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  }),
  indicatorSeparator: (styles: any) => ({
    ...styles,
    display: 'none',
  }),
};
