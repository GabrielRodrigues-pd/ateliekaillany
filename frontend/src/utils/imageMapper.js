// Utils to map imported images to string names from backend
import ovoTrio from "../assets/ovoTrio.png";
import ovoChocolatudo from "../assets/ovoChocolatudo.png";
import miniOvoColher from "../assets/miniOvoColher.png";
import ovoNinhoNutella from "../assets/ovoNinhoNutella.jpeg";
import ovoNinhoMorango from "../assets/ovoNinhoMorango.png";
import ovoDoisAmores from "../assets/ovoDoisAmores.png";
import sacolinha from "../assets/sacolinha.png";
import ovoBrownie from "../assets/ovoBrownie.jpeg";
import ovoFerrero from "../assets/ovoFerrero.png";
import ovoCasinha from "../assets/ovoCasinha.png";
import ovoTrufado from "../assets/ovoTrufado.png";
import ovoTradicional from "../assets/ovoTradicional.png";
import kitDesgustacao from "../assets/kitDesgustacao.png";

const imageMapper = {
  "ovoTrio.png": ovoTrio,
  "ovoChocolatudo.png": ovoChocolatudo,
  "miniOvoColher.png": miniOvoColher,
  "ovoNinhoNutella.png": ovoNinhoNutella,
  "ovoNinhoMorango.png": ovoNinhoMorango,
  "ovoDoisAmores.png": ovoDoisAmores,
  "sacolinha.png": sacolinha,
  "ovoBrownie.png": ovoBrownie,
  "ovoFerrero.png": ovoFerrero,
  "ovoCasinha.png": ovoCasinha,
  "ovoTrufado.png": ovoTrufado,
  "ovoTradicional.png": ovoTradicional,
  "kitDesgustacao.png": kitDesgustacao,
};

export const getImage = (imageName) => {
  return imageMapper[imageName] || null;
};
