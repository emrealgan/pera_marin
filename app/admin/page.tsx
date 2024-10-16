"use client";
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import { signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  brand: string;
  code: string;
  urls: string[];
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isFilter, setIsFilter] = useState(false); // Arama yapılıp yapılmadığını takip eder
  const [showAdding, setShowAdding] = useState(false);
  const [formData, setFormData] = useState<Product>({
    _id: '',
    name: '',
    brand: '',
    code: '',
    urls: []
  });
  const [files, setFiles] = useState<File[] | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);

  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/getProducts');
      const data = await res.json();
      setProducts(data.products);
      setFilteredProducts(data.products);
    } catch (error) {
      toast.error('Error fetching products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const cleanForm = () => {
    setFiles(null);
    setImagePreviews(null);
    setFormData({
      _id: '',
      name: '',
      brand: '',
      code: '',
      urls: []
    });
  };

  const toggleAddProductForm = () => {
    setShowAdding(!showAdding);
    cleanForm();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name == "code") {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value.toLowerCase(),
      });

    }
    else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value.toLocaleUpperCase()
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles); // Convert FileList to an array
      setFiles(fileArray); // Set the selected files

      const filePreviews = fileArray.map((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        return new Promise<string>((resolve) => {
          reader.onload = () => {
            resolve(reader.result as string);
          };
        });
      });

      // Wait for all file previews to be read before setting the previews state
      Promise.all(filePreviews).then((previews) => {
        setImagePreviews(previews);
      });
    }
    // reader.readAsDataURL(selectedFile);
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);

    try {
      let imageUrl = formData.urls;

      if (files) {
        const fileData = new FormData();
        files.forEach((file) => {
          fileData.append('file', file); // Append each file one by one
        });
        fileData.append('code', formData.code);

        const uploadRes = await fetch('/api/uploadImage', {
          method: 'POST',
          body: fileData,
        });

        if (!uploadRes.ok) {
          const errorData = await uploadRes.json();
          toast.error(`Error: ${errorData.message}`);
          return;
        }
        const { urls } = await uploadRes.json();
        formData.urls = urls; // Update form data with new image URL
        imageUrl = urls;
      }

      const res = await fetch("/api/addProduct", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, url: imageUrl }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(`Error: ${errorData.message}`);
        return;
      }

      toast.success('Product added successfully!');
      cleanForm();
      setImagePreviews(null);
      fetchProducts();
      toggleAddProductForm();
    } catch (error) {
      toast.error("Error");
    } finally {
      setAddLoading(false);
    }
  };

  const handleDelete = async (productID: string) => {
    setDeleteLoading(productID);
    try {
      const res = await fetch(`/api/deleteProduct/${productID}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete product');

      toast.success('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      toast.error('Error deleting product.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      toast.error('Error during logout.');
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    if (query) {
      setIsFilter(true); // Arama yapıldığında filtre moduna geç
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase()) ||
        product.code.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setIsFilter(false); // Arama yapılmadığında tüm ürünleri göster
      setFilteredProducts(products); // Tüm ürünleri tekrar göster
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center min-h-screen bg-gray-100 p-6 pt-32">
        <Toaster position="top-right" reverseOrder={false} />
        <SearchBar onSearch={handleSearch} />

        <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-4xl p-8">
          <h1 className="text-3xl font-semibold text-gray-700 mb-4 sm:mb-0">Product List</h1>
          <button
            onClick={toggleAddProductForm}
            className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
          >
            {showAdding ? 'Cancel' : 'Add Product'}
          </button>
        </div>

        {showAdding && (
          <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
              'Add New Product'
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => handleChange(e)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={(e) => handleChange(e)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Product Code</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={(e) => handleChange(e)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Upload Image</label>
                <label
                  htmlFor="file-upload"
                  className="mt-1 block w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded-md shadow-sm cursor-pointer bg-gray-200 text-teal-600 text-center font-medium hover:bg-gray-300"
                >
                  Select File
                </label>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".png, .jpg, .jpeg, .svg, .gif, .psd"
                  onChange={handleFileChange}
                  className="sr-only"
                />
                {imagePreviews && (
                  <div className="mt-4 flex justify-self-start">
                    {imagePreviews.map((image, index) => (
                      <img
                        key={index} // Ensure a unique key for each image
                        src={image}
                        alt={`Selected file ${index + 1}`} // Use the index for a unique alt text
                        className="w-32 h-32 object-contain"
                      />
                    ))}

                  </div>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="w-1/3 bg-teal-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-teal-700"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
          {loading ? (
            <p className="text-gray-600 text-center">Loading...</p>
          ) : isFilter && filteredProducts.length === 0 ? (
            <p className="text-gray-600 text-center">No products found.</p>
          ) : (
            (isFilter ? filteredProducts : products).map((product) => (
              <ul className="divide-y divide-gray-200" key={product._id}>
                <li className="py-4 flex flex-col md:flex-row justify-between items-center">
                  <div className="flex items-center">
                    <img src={product.urls[0]} alt={product.name} className="h-32 w-32 object-contain mr-4" />
                    <div>
                      <p className="text-lg font-semibold text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.brand}</p>
                      <p className="text-xs text-gray-600">{product.code}</p>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex">

                    <button
                      onClick={() => handleDelete(product._id)}
                      disabled={deleteLoading === product._id}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    >
                      {deleteLoading === product._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </li>
              </ul>
            ))
          )}
        </div>

        <button
          onClick={handleLogout}
          className="mt-10 bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
        >
          {logoutLoading ? 'Logging out...' : 'Log out'}
        </button>
      </main>
    </>
  );
}
