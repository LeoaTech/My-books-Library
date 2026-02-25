
export const getCustomSelectStyles = (theme) => ({
  control: (base, state) => ({
    ...base,
    backgroundColor: "var(--color-background)",
    borderColor: "var(--color-border)",
    boxShadow: state.isFocused ? "0 0 0 1px var(--color-primary)" : "none",
    color: "var(--color-text)",
    padding: "6px",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "var(--color-surface)",
    zIndex: 9999,
    color: "var(--color-text)",
  }),
  singleValue: (base) => ({
    ...base,
    color: "var(--color-text)",
  }),
  input: (base) => ({
    ...base,
    color: "var(--color-text)",
    borderColor: "var(--color-border)",

  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused
      ? "var(--color-background)"
      : "var(--color-surface)",
    color: "var(--color-text)",
  }),
  placeholder: (base) => ({
    ...base,
    // color: "var(--color-text)",
    whiteSpace: "nowrap",      /* Prevents text from wrapping to a new line */
    overflow: "hidden",          /* Hides the text that extends outside the box */
    textOverflow: "ellipsis",
    color: theme === "dark" ? "#ccc" : "#595151",

  }),
});




export const countryCustomSelectStyles = (theme) => ({
  control: (base, state) => ({
    ...base,
    backgroundColor: "var(--color-background)",
    borderColor: "var(--color-border)",
    borderRadius: "0.5rem",
    boxShadow: state.isFocused ? "0 0 0 1px var(--color-primary)" : "none",
    color: "var(--color-text)",
    padding: "2px",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "var(--color-surface)",
    zIndex: 9999,
    color: "var(--color-text)",
  }),
  singleValue: (base) => ({
    ...base,
    color: "var(--color-text)",
  }),
  input: (base) => ({
    ...base,
    color: "var(--color-text)",
    borderColor: "var(--color-border)"
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused
      ?  "var(--color-background)"
      : "var(--color-surface)",
    color: theme === "dark" ? "#fff" : "#000",
  }),
  placeholder: (base) => ({
    ...base,
    color: theme === "dark" ? "#ccc" : "#666",
  }),
});
