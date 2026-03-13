import { useState, useEffect } from "react";
import "./Creations.css";
import Carrossel from "../Carrossel";
import api from "../../services/api";
import { getImage } from "../../utils/imageMapper";
import LoadingOverlay from "../LoadingOverlay";



export default function Creations() {
  const [creations, setCreations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCreations = async () => {
      try {
        const response = await api.get('/products');
        // Transform the backend product data into the format the carousel expects
        const mappedCreations = response.data
          .filter(product => product.imageUrl) // only items with images
          .map(product => ({
            image: getImage(product.imageUrl),
            title: product.title,
            description: product.description,
            altText: `${product.title} - ${product.description.substring(0, 50)}...`
          }));
        
        setCreations(mappedCreations);
        setIsLoading(false);
      } catch (err) {
        console.error("Erro ao buscar criações:", err);
        setIsLoading(false);
      }
    };
    fetchCreations();
  }, []);

  return (
    <section className="creations" id="criacoes">
      <div className="container creations-header">
        <h2>Nossas criações</h2>
        <p>Cada ovo é uma pequena obra de arte.</p>
        <p className="creations-disclaimer">* Imagens meramente ilustrativas para referência de modelos e sabores.</p>
        
        {isLoading ? (
          <LoadingOverlay message="Nossas criações estão chegando..." />
        ) : (
          <Carrossel items={creations} />
        )}
      </div>
    </section>
  );
}
