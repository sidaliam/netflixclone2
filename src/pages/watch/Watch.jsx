import React from "react";
import LecteurTel from "../Lecteur/LecteurTel";
import LecteurPC from "../Lecteur/LecteurPc";

export default function Watch() {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile ? <LecteurTel /> : <LecteurPC />;
}
