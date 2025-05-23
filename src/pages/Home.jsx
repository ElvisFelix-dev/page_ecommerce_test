import { useEffect, useState } from "react";
import nikeBranco from "../assets/nike_branco.jpg";
import nikePreto from "../assets/nike_preto.jpg";
import nikeVerde from "../assets/nike_verde.jpg";

const product = {
  title: "Tênis NIKE Revolutin 7",
  price: 299.9,
  variants: [
    { color: "Branco", image: nikeBranco },
    { color: "Preto", image: nikePreto },
    { color: "Verde", image: nikeVerde },
  ],
  sizes: ["38", "39", "40", "41", "42"],
};

const KEY_STORAGE = "produto-user-state";

export default function App() {
  const [selectedColor, setSelectedColor] = useState(product.variants[0].color);
  const [mainImage, setMainImage] = useState(product.variants[0].image);
  const [selectedSize, setSelectedSize] = useState(null);
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(KEY_STORAGE));
    if (saved && Date.now() - saved.timestamp < 15 * 60 * 1000) {
      setSelectedColor(saved.selectedColor);
      setMainImage(saved.mainImage);
      setSelectedSize(saved.selectedSize);
      setCep(saved.cep);
      setAddress(saved.address);
    }
  }, []);

  useEffect(() => {
    const toSave = {
      selectedColor,
      mainImage,
      selectedSize,
      cep,
      address,
      timestamp: Date.now(),
    };
    localStorage.setItem(KEY_STORAGE, JSON.stringify(toSave));
  }, [selectedColor, mainImage, selectedSize, cep, address]);

  const buscarEndereco = async () => {
    if (cep.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data.erro) return setAddress("CEP inválido");
      setAddress(
        `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`
      );
    } catch {
      setAddress("Erro ao buscar endereço");
    }
  };

  return (
    <main className="max-w-5xl mx-auto p-4">
      <section className="flex flex-col md:flex-row gap-6">
        {/* Imagem principal e miniaturas */}
        <div className="w-full md:w-1/3">
          <img
            src={mainImage}
            alt={`Tênis na cor ${selectedColor}`}
            className="w-full h-80 object-contain rounded bg-gray-100"
          />
          <div
            className="flex gap-2 mt-2"
            role="list"
            aria-label="Miniaturas de imagens do produto"
          >
            {product.variants.map(({ color, image }) => (
              <img
                key={color}
                src={image}
                alt={`Tênis na cor ${color}`}
                className={`w-16 h-16 object-cover border cursor-pointer rounded ${
                  selectedColor === color ? "border-blue-500 border-2" : ""
                }`}
                role="listitem"
                tabIndex={0}
                onClick={() => {
                  setSelectedColor(color);
                  setMainImage(image);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSelectedColor(color);
                    setMainImage(image);
                  }
                }}
                aria-pressed={selectedColor === color}
              />
            ))}
          </div>
        </div>

        {/* Informações do produto */}
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{product.title}</h1>
          <p className="text-xl text-green-600 font-bold my-2">
            R$ {product.price.toFixed(2)}
          </p>

          {/* Seleção de Tamanho */}
          <fieldset className="mt-4">
            <legend className="font-medium">Tamanho:</legend>
            <div
              className="flex gap-2 mt-1"
              role="radiogroup"
              aria-label="Seleção de tamanho"
            >
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  title="Tamanho do produto"
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    selectedSize === size ? "bg-blue-500 text-white" : ""
                  }`}
                  aria-pressed={selectedSize === size}
                >
                  {size}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Seleção de Cor */}
          <fieldset className="mt-4">
            <legend className="font-medium">Cor:</legend>
            <div
              className="flex gap-2 mt-1"
              role="radiogroup"
              aria-label="Seleção de cor"
            >
              {product.variants.map(({ color, image }) => (
                <button
                  key={color}
                  type="button"
                  title="Cor do produto"
                  onClick={() => {
                    setSelectedColor(color);
                    setMainImage(image);
                  }}
                  className={`px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    selectedColor === color ? "bg-blue-500 text-white" : ""
                  }`}
                  aria-pressed={selectedColor === color}
                >
                  {color}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Consulta CEP Pela API */}
          <section className="mt-6" aria-labelledby="cep-title">
            <h2 id="cep-title" className="font-medium">
              Verificar entrega:
            </h2>
            <form className="flex gap-2 mt-1" onSubmit={(e) => { e.preventDefault(); buscarEndereco(); }} aria-describedby="cepHelp">
              <label htmlFor="cep" className="sr-only">
                Digite seu CEP
              </label>
              <input
                id="cep"
                type="text"
                value={cep}
                required
                onChange={(e) =>
                  setCep(e.target.value.replace(/\D/g, "").slice(0, 8))
                }
                placeholder="Digite seu CEP"
                className="text-black border p-2 rounded w-40 focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-describedby="cepHelp"
              />
              <button
                type="submit"
                title="Botão de buscar"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Buscar endereço pelo CEP"
              >
                Buscar
              </button>
            </form>
            <p
              id="cepHelp"
              title="Endereço para entrega"
              className={`mt-2 text-sm ${address && address.includes("CEP inválido") ? "text-red-600" : "text-white"}`}
              aria-live="polite"
            >
              {address || "Informe um CEP válido para verificar disponibilidade de entrega."}
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
