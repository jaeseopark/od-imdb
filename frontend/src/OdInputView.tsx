import { useState } from "react";

const OdInputView = () => {
  const [od, setOd] = useState<string>();

  const applyOdUrl = () => {
    window.location.href = `?od=${od}`;
  };

  // @ts-ignore
  const onTextChange = (e) => {
    if (e.key === "ENTER") {
      return applyOdUrl();
    }

    setOd(e.target.value);
  };

  return (
    <div>
      <div>Enter an open directory URL below:</div>
      <div>
        <input type="text" onChange={onTextChange} />
        <button onClick={applyOdUrl}>OK</button>
      </div>
    </div>
  );
};

export default OdInputView;
