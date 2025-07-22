
const theme = localStorage.getItem("color-theme").replace(/"/g, '');
export const newStyles = {

    control: (base, state) => ({
        ...base,
        backgroundColor: theme === "dark" ? "#1d2a39 !important" : "#fff !important",
        borderColor: state.isFocused ? "#3C50E0" : "#E2E8F0",
        boxShadow: state.isFocused ? "0 0 0 1px #3C50E0" : "none",
        color: theme === "dark" ? "#fff !important" : "#000 !important",
        padding: "6px",
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: theme === "dark" ? "#1d2a39 !important" : "#fff !important",
        zIndex: 9999,
        color: theme === "dark" ? "#fff !important" : "#000 !important",
    }),
    singleValue: (base) => ({
        ...base,
        color: theme === "dark" ? "#fff !important" : "#000 !important",
    }),
    input: (base) => ({
        ...base,
        color: theme === "dark" ? "#fff" : "#000",
    })
    ,
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused
            ? theme === "dark" ? "#2c3e50 !important" : "#e2e8f0 !important"
            : theme === "dark" ? "#1d2a39 !important" : "#fff !important",
        color: theme === "dark" ? "#fff !important" : "#000 !important",
    }),
    // Add placeholder style if needed
    placeholder: (base) => ({
        ...base,
        color: theme === "dark" ? "#ccc" : "#666",
    }),
};