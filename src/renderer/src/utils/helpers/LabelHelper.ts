class LabelHelper {
  static emptyCharacter = (val: string) => {
    return val === "-" || val === "/" ? "" : val;
  };

  static badStringToGood = (val: string) => {
    if (val.trim().endsWith("/")) {
      return val.trim().slice(0, -1).trim();
    }

    return val;
  };

  static isEmpty = (val: string) => {
    return val === "-" || val === "/" || val === "" ? "" : val;
  };
}

export default LabelHelper;
