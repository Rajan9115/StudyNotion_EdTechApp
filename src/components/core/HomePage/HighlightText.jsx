import React from "react";

const HighlightText = ({text}) => {
  return (
    <span className="bg-gradient-to-b from-[#7633ea] via-[#8a49ea] to-[#bbf1d2] text-transparent bg-clip-text font-semibold">
      {" "}
      {text}
    </span>
  );
};

export default HighlightText;