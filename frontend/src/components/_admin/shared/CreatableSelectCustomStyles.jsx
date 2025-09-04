
export const getCustomSelectStyles = (theme) => ({
  control: (base, state) => ({
    ...base,
    backgroundColor: theme === "dark" ? "#1d2a39" : "#fff",
    borderColor: theme === "dark" ? "rgb(61 77 96)" : "#E2E8F0",
    // borderColor: state.isFocused ? "#3C50E0" : "rgb(61 77 96)" || "#E2E8F0",

    boxShadow: state.isFocused ? "0 0 0 1px #3C50E0" : "none",
    color: theme === "dark" ? "#fff" : "#000",
    padding: "6px",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: theme === "dark" ? "#1d2a39" : "#fff",
    zIndex: 9999,
    color: theme === "dark" ? "#fff" : "#000",
  }),
  singleValue: (base) => ({
    ...base,
    color: theme === "dark" ? "#fff" : "#000",
  }),
  input: (base) => ({
    ...base,
    color: theme === "dark" ? "#fff" : "#000",
    borderColor: "#E2E8F0"
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused
      ? theme === "dark" ? "#2c3e50" : "#e2e8f0"
      : theme === "dark" ? "#1d2a39" : "#fff",
    color: theme === "dark" ? "#fff" : "#000",
  }),
  placeholder: (base) => ({
    ...base,
    color: theme === "dark" ? "#ccc" : "#666",
  }),
});
