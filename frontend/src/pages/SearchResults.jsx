import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useGetSearchedProductsQuery } from "../redux/api/productApiSlice";
import Product from "./Products/Product";
import Loader from "../components/Loader";

const SearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword") || "";

  const { data: products, isLoading, error } = useGetSearchedProductsQuery(keyword, {
    skip: !keyword, // skip query if no keyword
  });

  return (
    <div className="container mx-auto mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold ml-[10rem]">Search Results for "{keyword}"</h2>
        <Link to="/shop" className="text-white hover:underline mr-[10rem]">
          Go Back
        </Link>
      </div>
      
      {isLoading ? (
        <Loader />
      ) : error ? (
        <div className="text-red-500 text-center mt-10 text-xl font-bold">
          Error loading search results
        </div>
      ) : products?.length === 0 ? (
        <div className="text-center mt-10 text-xl font-bold">
          No products found
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-8">
          {products?.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
