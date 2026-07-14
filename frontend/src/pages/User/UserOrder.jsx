import { useState } from "react";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

import ContentWrapper from "../../components/ContentWrapper";
const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = orders?.filter((order) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const matchId = order._id.toLowerCase().includes(term);
    const matchProductName = order.orderItems?.some((item) =>
      item.name.toLowerCase().includes(term)
    );
    return matchId || matchProductName;
  });

  return (
    <div className=" mx-auto bg-[#0E1629] min-h-[100vh] text-white">
      <ContentWrapper>
        <h2 className="text-2xl font-semibold mb-4">My Orders </h2>
        <div className="mb-4 mx-4">
          <input
            type="text"
            placeholder="Search orders by ID or Product Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 text-black rounded-lg focus:outline-none"
          />
        </div>

        {isLoading ? (
          <div className="w-full flex items-center justify-center h-full">
            <Loader />
          </div>
        ) : error ? (
          <Message variant="danger">
            {error?.data?.error || error.error}
          </Message>
        ) : filteredOrders?.length === 0 ? (
          <div className="text-center w-full mt-10 text-xl font-bold">
            No orders found
          </div>
        ) : (
          <table className="w-full mx-4">
            <thead className="">
              <tr className="border-b border-[#444444] mb-4">
                <td className="py-2">IMAGE</td>
                <td className="py-2">ID</td>
                <td className="py-2">DATE</td>
                <td className="py-2">TOTAL</td>
                <td className="py-2">PAID</td>
                <td className="py-2">DELIVERED</td>
                <td className="py-2"></td>
              </tr>
            </thead>

            <tbody className="my-8">
              {filteredOrders?.map((order) => (
                <tr key={order._id}>
                  <td>
                    <img
                      src={order.orderItems[0].image}
                      alt={order.user}
                      className="w-[6rem] mb-5"
                    />
                  </td>

                  <td className="py-2">{order._id}</td>
                  <td className="py-2">{order.createdAt.substring(0, 10)}</td>
                  <td className="py-2">$ {order.totalPrice}</td>

                  <td className="py-2">
                    {order.isPaid ? (
                      <p className="px-2 py-1 text-center bg-[#2765EC] max-w-[70%] rounded">
                        Completed
                      </p>
                    ) : (
                      <p className="px-2 py-1 text-center bg-[#FF2E63] max-w-[70%] rounded">
                        Pending
                      </p>
                    )}
                  </td>

                  <td className="px-2 py-2">
                    {order.isDelivered ? (
                      <p className="px-2 py-1 text-center bg-[#2765EC] max-w-[70%] rounded">
                        Completed
                      </p>
                    ) : (
                      <p className="px-2 py-1 text-center bg-[#FF2E63] max-w-[70%] rounded">
                        Pending
                      </p>
                    )}
                  </td>

                  <td className="px-2 py-2">
                    <Link to={`/order/${order._id}`}>
                      <button className="px-2 py-1 text-center bg-[#2765EC] max-w-[70%] rounded">
                        View Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </ContentWrapper>
    </div>
  );
};

export default UserOrder;
