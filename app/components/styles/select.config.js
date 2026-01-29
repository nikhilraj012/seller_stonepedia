export const selectCommonStyles = {
    control: (base) => ({ ...base, cursor: "pointer", outline: "none" }),
    option: (base) => ({ ...base, cursor: "pointer" }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
     menuList: (base) => ({
    ...base,
    scrollbarWidth: "none",       
    msOverflowStyle: "none",     
    "&::-webkit-scrollbar": {
      display: "none",             
    },
  }),
  };

 export  const selectCommonTheme = (theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary: "#871B58",
      primary25: "#f3f4f6",
      primary50: "transparent",
    },
  });