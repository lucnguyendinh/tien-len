// components/NoTextSelect.js

import React, { useEffect } from "react";

const NoTextSelect = () => {
  useEffect(() => {
    document.addEventListener("selectstart", function (e) {
      e.preventDefault();
    });

    return () => {
      document.removeEventListener("selectstart", function (e) {
        e.preventDefault();
      });
    };
  }, []);

  return null;
};

export default NoTextSelect;
