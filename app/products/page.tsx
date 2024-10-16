"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import SearchBar from '@/components/SearchBar';

interface Product {
  brand: string;
  name: string;
  code: string;
  urls: string[];  // Array to hold multiple image URLs
}

type CurrentImageIndex = {
  [key: string]: number; // each product's code as the key and a number as the value
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<CurrentImageIndex>({});
  const [hoveredProductCode, setHoveredProductCode] = useState<string | null>(null); // Store currently hovered product code

  const handleMouseEnter = (code: string) => {
    setHoveredProductCode(code);
    // Start cycling through images, starting from the second image
    setCurrentImageIndex((prev) => ({
      ...prev,
      [code]: 1,
    }));
  };

  const handleMouseLeave = (code: string) => {
    setHoveredProductCode(null);
    setCurrentImageIndex((prev) => ({
      ...prev,
      [code]: 0, // Revert to the first image on mouse leave
    }));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/getProducts");
        if (!response.ok) {
          throw new Error("Veriler çekilirken bir hata oluştu.");
        }
        const data = await response.json();
        setProducts(data.products);
        setFilteredProducts(data.products);
      } catch (err) {
        if (err instanceof Error) {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (query: string) => {
    if (query) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase()) ||
        product.code.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (hoveredProductCode) {
      const currentProduct = products.find(product => product.code === hoveredProductCode);
      const imageCount = currentProduct?.urls.length || 0;

      interval = setInterval(() => {
        setCurrentImageIndex(prev => {
          const currentIndex = prev[hoveredProductCode] || 1; // Start from second image
          // Stop cycling if we're on the last image
          if (currentIndex < imageCount - 1) {
            const nextIndex = currentIndex + 1; // Move to the next image
            return {
              ...prev,
              [hoveredProductCode]: nextIndex,
            };
          } else {
            return prev; // Do not change the index when on the last image
          }
        });
      }, 1000); // Change image every 1 second
    }

    return () => {
      clearInterval(interval);
    };
  }, [hoveredProductCode, products]);

  if (loading) return <div className="h-full w-full flex items-center justify-center text-6xl text-gray-500"><p>◌</p></div>;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-100 p-6 pt-32">
        <SearchBar onSearch={handleSearch} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts &&
            filteredProducts.map((product) => (
              <div
                key={product.code}
                className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
                onMouseEnter={() => handleMouseEnter(product.code)}
                onMouseLeave={() => handleMouseLeave(product.code)}
              >
                <div className="relative flex items-center justify-center h-60 w-full border-b-4 border-gray-200 bg-gray-100 group">
                  {/* Loop through the images dynamically */}
                  {product.urls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={product.name}
                      className={`absolute inset-0 object-contain h-full w-full transition-opacity duration-500 ease-in-out ${index === (currentImageIndex[product.code] || 0) ? "opacity-100" : "opacity-0"
                        }`}
                    />
                  ))}
                </div>
                <div className="p-4">
                  <h2 className="text-2xl font-semibold mb-2 text-gray-600">{product.name}</h2>
                  <p className="text-gray-500 mb-2">{product.brand}</p>
                  <p className="text-gray-500">{product.code}</p>
                </div>
              </div>
            ))}
        </div>
      </main>
    </>
  );
}
