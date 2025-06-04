const customSelectStyles = {
  control: (base) => ({ ...base, 'min-height': 28, height: 28 }),
  valueContainer: (base) => ({ ...base, 'min-height': 28, height: 28, fontWeight: "600", overflow: "visible" }),
  indicatorsContainer: (base) => ({ ...base, 'min-height': 28, height: 28 }),
  menuItem: (base) => ({ ...base, 'min-height': 28, height: 28 }),
  placeholder: (base, state) => ({
    ...base,
    position: "absolute",
    top: state.hasValue || state.selectProps.inputValue ? "-10px" : "0%",
    transition: "top 0.1s, font-size 0.1s",
    backgroundColor: "white",
    color: "#919397",
    padding: "0 3px",
    fontSize: (state.hasValue || state.selectProps.inputValue) && 'x-small'
  }),
  input: (base) => ({
    ...base,
    padding: '0',
    margin: '0',
  }),

};
export default customSelectStyles