"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import SearchBar from '@/components/SearchBar';

interface Product {
  brand: string;
  name: string;
  code: string;
  url: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);


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
          console.error(err)
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
  if (loading) return <div className="h-full w-full flex items-center justify-center text-6xl text-gray-500"><p>◌</p></div>;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-100 p-6 pt-32">
        <SearchBar onSearch={handleSearch} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts && filteredProducts.map((product) => (
            <div key={product.code} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl">
              <div className="relative flex items-center justify-center h-60 w-full border-b-4 border-gray-200 bg-gray-100">
                <img
                  src={product.url}
                  alt={product.name}
                  className="object-contain h-full"
                />
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