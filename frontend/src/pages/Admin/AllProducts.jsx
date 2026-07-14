import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import { useEffect, useState } from "react";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading products</div>;
  }

  const filteredProducts = products?.filter((product) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      product.name?.toLowerCase().includes(term) ||
      product.description?.toLowerCase().includes(term)
    );
  });

  return (
    <>
      <div className="bg-[#0E1629] min-h-[100vh]">
        <div className="">
          <div className="p-3">
            <div className="text-center text-xl md:text-2xl font-bold">
              All Products ({products.length})
            </div>
            <div className="flex justify-center mt-4">
              <input
                type="text"
                placeholder="Search products by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-1/2 px-4 py-2 bg-[#0E1527] border border-[#959fb3] focus:border-[#1b56d5] outline-none text-white placeholder-white rounded-sm"
              />
            </div>
            {filteredProducts?.length === 0 ? (
              <div className="text-center w-full mt-10 text-xl font-bold text-white">
                No products found
              </div>
            ) : (
              <div className="flex flex-wrap justify-around items-center gap-6 flex-col mt-[1rem]">
                {filteredProducts?.map((product) => (
                  <div key={product._id} className="w-full px-4">
                  {/* <Link
                  key={product._id}
                  to={`/admin/product/update/${product._id}`}
                  className="block mb-4 overflow-hidden"
                > */}
                  <div className="flex justify-center flex-col md:flex-row">
                    <img
                      src={product.image ? (product.image.startsWith('http') ? product.image : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${product.image}`) : "/images/placeholder.jpg"}
                      alt={product.name}
                      className="w-[10rem] object-contain object-center"
                    />
                    <div className="p-4 flex flex-col justify-around">
                      <div className="flex justify-between">
                        <h5 className="text-xl font-semibold mb-2">
                          {product?.name?.substring(0, 30)}...
                        </h5>

                        <p className="text-gray-400 text-xs">
                          {moment(product.createdAt).format("MMMM Do YYYY")}
                        </p>
                      </div>

                      <p className="text-gray-400 xl:w-[30rem] lg:w-[30rem] md:w-[20rem] sm:w-[10rem] text-sm mb-4">
                        {product?.description?.substring(0, 120)}...
                      </p>

                      <div className="flex justify-between">
                        <Link
                          to={`/admin/product/update/${product._id}`}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-[#db1143f3] rounded border-none outline-none hover:bg-[#FF2E63]"
                        >
                          Update Product
                          <svg
                            className="w-3.5 h-3.5 ml-2"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M1 5h12m0 0L9 1m4 4L9 9"
                            />
                          </svg>
                        </Link>
                        <p>$ {product?.price}</p>
                      </div>
                    </div>
                  </div>
                  {/* </Link> */}
                </div>
                ))}
              </div>
            )}
          </div>

          {/* <div className="md:w-1/4 p-3 mt-2">
            <AdminMenu />
          </div> */}
        </div>
      </div>
    </>
  );
};

export default AllProducts;
