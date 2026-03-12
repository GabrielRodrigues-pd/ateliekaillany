import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import OptimizedImage from "../OptimizedImage";
import "./CardsIndulge.css";

function CardsIndulge({ id, categoria, title, descri, img, alt, price, prices }) {
  const { addToCart } = useCart();
  
  const isTrio = categoria === "Trio de Ovos";
  const isMini = categoria === "Colher 50g";
  const isTrufado = categoria === "Ovo Trufado";
  const availableSizes = prices && typeof prices === 'object' ? Object.keys(prices) : [];
  const hasMultiplePrices = availableSizes.length > 0;
  const hasOptions = hasMultiplePrices || isTrio || isMini || isTrufado;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(hasMultiplePrices ? availableSizes[0] : null);
  const [selectedFlavors, setSelectedFlavors] = useState({
    flavor1: "",
    flavor2: "",
    flavor3: ""
  });

  const flavorOptions = [
    "Chocolatudo",
    // "Ferrero", não quer mais o ferreiro rocher
    "Ninho com Nutella",
    "Brownie",
    "Ninho com Morango",
    "Dois Amores"
  ];

  const trufadoOptions = [
    "Chocolate",
    "Ninho com Nutella",
    "Dois Amores"
  ];

  // Block body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const handleFlavorChange = (field, value) => {
    setSelectedFlavors(prev => ({ ...prev, [field]: value }));
  };

  const currentPrice = hasMultiplePrices ? prices[selectedSize] : price;

  const handleAddToCart = (e) => {
    e.preventDefault();

    let finalId = id;
    let finalTitle = title;
    
    if (selectedSize) {
      finalId += `-${selectedSize}`;
      finalTitle += ` (${selectedSize})`;
    }

    if (isTrio) {
      if (!selectedFlavors.flavor1 || !selectedFlavors.flavor2 || !selectedFlavors.flavor3) {
        alert("Por favor, selecione os 3 sabores para o Trio de Ovos.");
        return;
      }
      const flavorsStr = `${selectedFlavors.flavor1}, ${selectedFlavors.flavor2}, ${selectedFlavors.flavor3}`;
      finalId += `-[${flavorsStr}]`;
      finalTitle += ` - Sabores: ${flavorsStr}`;
    } else if (isMini) {
      if (!selectedFlavors.flavor1) {
        alert("Por favor, selecione um sabor para o Mini Ovo.");
        return;
      }
      finalId += `-[${selectedFlavors.flavor1}]`;
      finalTitle += ` - Sabor: ${selectedFlavors.flavor1}`;
    } else if (isTrufado) {
      if (!selectedFlavors.flavor1) {
        alert("Por favor, selecione um sabor para o Ovo Trufado.");
        return;
      }
      finalId += `-[${selectedFlavors.flavor1}]`;
      finalTitle += ` - Sabor: ${selectedFlavors.flavor1}`;
    }

    addToCart({ id: finalId, title: finalTitle, price: currentPrice, img });
    
    if (isTrio || isMini || isTrufado) {
      setSelectedFlavors({ flavor1: "", flavor2: "", flavor3: "" });
    }
    setIsModalOpen(false);
  };

  const basePriceValue = hasMultiplePrices 
    ? Math.min(...availableSizes.map(size => prices[size])) 
    : (price || 0);

  const formattedBasePrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(basePriceValue);

  const formattedCurrentPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(currentPrice || 0);

  return (
    <>
      <article className="indulge-card">
        <div className="card-content">
          <span className="card-tag">{categoria}</span>
          <h3 className="card-title">{title}</h3>
          <p className="card-description">{descri}</p>

          <div className="card-footer">
            <span className="card-price" aria-label={`Preço a partir de: ${formattedBasePrice}`}>
              {hasMultiplePrices ? `A partir de ${formattedBasePrice}` : formattedBasePrice}
            </span>
            {hasOptions ? (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="add-to-cart-btn options-btn"
                aria-label={`Escolher opções para ${title}`}
              >
                Escolher Opções
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAddToCart}
                className="add-to-cart-btn"
                aria-label={`Adicionar ${title} ao carrinho`}
              >
                Adicionar
              </button>
            )}
          </div>
        </div>

        <div className="card-image">
          <OptimizedImage src={img} alt={alt || title} />
        </div>
      </article>

      {/* MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>
              &times;
            </button>
            
            <div className="modal-header">
              <img src={img} alt={title} className="modal-img" />
              <div className="modal-header-info">
                <h3>{title}</h3>
                <p>{descri}</p>
                <span className="modal-price">{formattedCurrentPrice}</span>
              </div>
            </div>

            <div className="modal-body">
              {hasMultiplePrices && (
                <div className="modal-section card-size-selector">
                  <span className="section-label">Escolha o Tamanho:</span>
                  <div className="size-options">
                    {availableSizes.map((size) => (
                      <label key={`size-${id}-${size}`} className={`size-option ${selectedSize === size ? "active" : ""}`}>
                        <input
                          type="radio"
                          name={`size-modal-${id}`}
                          value={size}
                          checked={selectedSize === size}
                          onChange={() => setSelectedSize(size)}
                        />
                        {size}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {isTrio && (
                <div className="modal-section card-flavors-selector">
                  <span className="section-label">Escolha os 3 sabores:</span>
                  <select
                    value={selectedFlavors.flavor1}
                    onChange={(e) => handleFlavorChange("flavor1", e.target.value)}
                    className="flavor-select"
                  >
                    <option value="" disabled>Selecione o Sabor 1</option>
                    {flavorOptions.map((flavor) => (
                      <option key={`m-f1-${flavor}`} value={flavor}>{flavor}</option>
                    ))}
                  </select>
                  <select
                    value={selectedFlavors.flavor2}
                    onChange={(e) => handleFlavorChange("flavor2", e.target.value)}
                    className="flavor-select"
                  >
                    <option value="" disabled>Selecione o Sabor 2</option>
                    {flavorOptions.map((flavor) => (
                      <option key={`m-f2-${flavor}`} value={flavor}>{flavor}</option>
                    ))}
                  </select>
                  <select
                    value={selectedFlavors.flavor3}
                    onChange={(e) => handleFlavorChange("flavor3", e.target.value)}
                    className="flavor-select"
                  >
                    <option value="" disabled>Selecione o Sabor 3</option>
                    {flavorOptions.map((flavor) => (
                      <option key={`m-f3-${flavor}`} value={flavor}>{flavor}</option>
                    ))}
                  </select>
                </div>
              )}

              {isMini && (
                <div className="modal-section card-flavors-selector">
                  <span className="section-label">Escolha o sabor:</span>
                  <select
                    value={selectedFlavors.flavor1}
                    onChange={(e) => handleFlavorChange("flavor1", e.target.value)}
                    className="flavor-select"
                  >
                    <option value="" disabled>Selecione um Sabor</option>
                    {flavorOptions.map((flavor) => (
                      <option key={`m-mini-${flavor}`} value={flavor}>{flavor}</option>
                    ))}
                  </select>
                </div>
              )}

              {isTrufado && (
                <div className="modal-section card-flavors-selector">
                  <span className="section-label">Escolha o sabor:</span>
                  <select
                    value={selectedFlavors.flavor1}
                    onChange={(e) => handleFlavorChange("flavor1", e.target.value)}
                    className="flavor-select"
                  >
                    <option value="" disabled>Selecione um Sabor</option>
                    {trufadoOptions.map((flavor) => (
                      <option key={`m-trufado-${flavor}`} value={flavor}>{flavor}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={handleAddToCart} className="modal-add-btn">
                Adicionar ao Carrinho - {formattedCurrentPrice}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CardsIndulge;
