import React, { useEffect, useState } from "react";
import {
  FaWrench,
  FaSearch,
  FaToolbox,
  FaBox,
  FaClock,
  FaCheckCircle,
  FaCalendar,
  FaTruck,
} from "react-icons/fa";
import axios from "axios";

function RiderHomepage() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [ordersToday, setOrdersToday] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    delivered: 0,
    todaysOrders: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapAddress, setMapAddress] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/orders");
        const orders = res.data;

        const filteredOrders = orders.filter((order) => {
          const orderDate = new Date(order.order_date)
            .toISOString()
            .split("T")[0];
          return orderDate === selectedDate;
        });

        const total = filteredOrders.length;
        const pending = filteredOrders.filter(
          (order) => order.status === "Pending"
        ).length;
        const delivered = filteredOrders.filter(
          (order) => order.status === "Delivered"
        ).length;

        setStats({
          total,
          pending,
          delivered,
          todaysOrders: total,
        });

        setOrdersToday(filteredOrders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    fetchOrders();

    const interval = setInterval(fetchOrders, 5000);

    return () => clearInterval(interval);
  }, [selectedDate]);

  const handleMarkAsDelivered = async (orderId) => {
    try {
      await axios.put(`http://localhost:8080/api/orders/${orderId}/delivered`);
      setOrdersToday((prev) =>
        prev.map((order) =>
          order.orderId === orderId ? { ...order, status: "Delivered" } : order
        )
      );
      setStats((prev) => ({
        ...prev,
        delivered: prev.delivered + 1,
        pending: prev.pending - 1,
      }));
    } catch (err) {
      console.error("Failed to mark order as delivered:", err);
    }
  };

  const filteredOrders = ordersToday.filter((order) =>
    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShowLocation = (address) => {
    setMapAddress(address);
    setShowMapModal(true);
  };

  const truckColors = [
    "text-blue-500",
    "text-red-500",
    "text-green-500",
    "text-yellow-500",
    "text-purple-500",
    "text-pink-500",
    "text-indigo-500",
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-black text-white py-4 shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="Logo"
              className="w-10 h-10 rounded-full object-cover mx-auto"
            />
            <h1 className="text-2xl font-bold">N-Tech Hardware</h1>
          </div>

          <div className="flex-1 flex justify-end mx-6">
            <div className="relative w-80">
              <input
                type="text"
                placeholder="Search by customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-blue-400 text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
            </div>
          </div>

          <div>
            <button
              onClick={() => {
                localStorage.removeItem("user");
                window.location.href = "http://localhost:5173";
              }}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-col items-start text-left mt-5 mx-6 px-6 py-20 bg-black rounded-2xl shadow-lg overflow-hidden">
        <FaWrench className="absolute top-10 left-10 text-gray-700 opacity-80 w-16 h-16 animate-bounce" />
        <FaToolbox className="absolute top-20 right-20 text-gray-700 opacity-80 w-16 h-16 animate-bounce" />

        <FaWrench className="absolute bottom-20 left-1/4 text-gray-700 opacity-70 w-14 h-14 animate-bounce" />
        <FaToolbox className="absolute bottom-16 right-1/3 text-gray-700 opacity-70 w-14 h-14 animate-bounce" />

        <FaWrench className="absolute top-1/3 right-1/4 text-gray-700 opacity-60 w-12 h-12 animate-bounce" />
        <FaToolbox className="absolute bottom-1/4 left-1/3 text-gray-700 opacity-60 w-12 h-12 animate-bounce" />

        <div className="relative z-10 ml-10">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Welcome to N-Tech Hardware
          </h2>
          <p className="text-gray-300 max-w-xl mb-6">
            You may have noticed some of the tools used during your home
            inspection. Now you too can own some of these tools and other items
            needed as a homeowner.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Dashboard Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-center justify-center">
            <FaBox className="text-blue-500 w-10 h-10 mb-2" />
            <h3 className="text-lg font-semibold mb-2">Total Deliveries</h3>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-center justify-center">
            <FaClock className="text-yellow-500 w-10 h-10 mb-2" />
            <h3 className="text-lg font-semibold mb-2">Pending Deliveries</h3>
            <p className="text-2xl font-bold">{stats.pending}</p>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-center justify-center">
            <FaCheckCircle className="text-green-500 w-10 h-10 mb-2" />
            <h3 className="text-lg font-semibold mb-2">Completed Deliveries</h3>
            <p className="text-2xl font-bold">{stats.delivered}</p>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-center justify-center">
            <FaCalendar className="text-red-500 w-10 h-10 mb-2" />
            <h3 className="text-lg font-semibold mb-2">Selected Date Orders</h3>
            <p className="text-2xl font-bold">{stats.todaysOrders}</p>
          </div>
        </div>

        {/* Today's Orders Card */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Today's Orders</h2>
          <input
            type="date"
            value={selectedDate}
            className="border border-gray-300 rounded px-3 py-2 text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
          {filteredOrders.length === 0 ? (
            <p className="text-gray-500 col-span-full">No orders found.</p>
          ) : (
            filteredOrders.map((order, index) => (
              <div
                key={order.orderId || index}
                className="relative bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col w-full p-8"
              >
                <FaTruck
                  className={`absolute right-10 top-40 transform -translate-y-1/2 w-50 h-50 opacity-100 pointer-events-none ${
                    truckColors[index % truckColors.length]
                  }`}
                />
                <div className="mb-2 relative z-10">
                  <h3 className="text-xl font-bold truncate">
                    {order.orderName}
                  </h3>
                </div>
                <div className="mb-4 relative z-10">
                  <p className="text-gray-700 truncate">
                    <span className="font-semibold">Customer:</span>{" "}
                    {order.customer_name}
                  </p>
                </div>
                <div className="mb-4 text-gray-700 text-base space-y-1 relative z-10">
                  <p>
                    <span className="font-semibold">Quantity:</span>{" "}
                    {order.quantity} {order.unit}
                  </p>
                  <p>
                    <span className="font-semibold">Total:</span> ₱
                    {order.total_price.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    {order.status}
                  </p>
                  <p>
                    <span className="font-semibold">Address:</span>{" "}
                    <span className="truncate">{order.address}</span>
                  </p>
                  <p>
                    <span className="font-semibold">Mobile:</span>{" "}
                    {order.contactNumber}
                  </p>
                  <p>
                    <span className="font-semibold">Payment Type:</span>{" "}
                    {order.payment_type}
                  </p>
                </div>
                <button
                  className={`mt-auto px-4 py-2 rounded text-green-500 border-2 border-green-500 transition font-semibold relative z-10 ${
                    order.status === "Delivered"
                      ? "bg-green-500 text-white cursor-not-allowed border-green-500"
                      : "hover:bg-green-500 hover:text-white"
                  }`}
                  disabled={order.status === "Delivered"}
                  onClick={() => handleMarkAsDelivered(order.orderId)}
                >
                  {order.status === "Delivered"
                    ? "Delivered"
                    : "Mark as Delivered"}
                </button>
                <button
                  className="px-4 py-2 rounded text-gray-700 border-2 mt-2 border-gray-400 hover:bg-gray-400 hover:text-white transition font-semibold"
                  onClick={() => handleShowLocation(order.address)}
                >
                  Show Location
                </button>
              </div>
            ))
          )}
        </div>

        {showMapModal && (
          <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-11/12 md:w-3/4 lg:w-1/2 p-4 relative">
              <button
                className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 font-bold text-lg"
                onClick={() => setShowMapModal(false)}
              >
                &times;
              </button>

              {/* Map iframe */}
              <div className="w-full h-96">
                <iframe
                  title="Google Map"
                  width="100%"
                  height="100%"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    mapAddress
                  )}&output=embed`}
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default RiderHomepage;
