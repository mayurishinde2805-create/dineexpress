import React, { useState, useEffect } from "react";
import axios from "axios";
import "./adminCustomers.css";

export default function AdminCustomers() {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            // Mock data - replace with actual API
            const mockCustomers = [
                {
                    id: 1,
                    name: "John Doe",
                    mobile: "+91 98765 43210",
                    email: "john@example.com",
                    table_number: 5,
                    total_orders: 12,
                    total_spent: 8500,
                    last_visit: "2026-01-11T14:30:00",
                    orders: [
                        { id: 101, date: "2026-01-11", items: 3, amount: 850 },
                        { id: 98, date: "2026-01-10", items: 2, amount: 620 },
                    ],
                },
                {
                    id: 2,
                    name: "Jane Smith",
                    mobile: "+91 87654 32109",
                    email: "jane@example.com",
                    table_number: 3,
                    total_orders: 8,
                    total_spent: 5200,
                    last_visit: "2026-01-11T12:15:00",
                    orders: [
                        { id: 102, date: "2026-01-11", items: 4, amount: 1200 },
                    ],
                },
                {
                    id: 3,
                    name: "Guest User",
                    mobile: "+91 76543 21098",
                    email: null,
                    table_number: 2,
                    total_orders: 1,
                    total_spent: 450,
                    last_visit: "2026-01-11T16:00:00",
                    orders: [
                        { id: 103, date: "2026-01-11", items: 2, amount: 450 },
                    ],
                },
            ];
            setCustomers(mockCustomers);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="admin-customers">
            <div className="customers-header">
                <div className="stats-row">
                    <div className="stat-card">
                        <span className="stat-label">Total Customers</span>
                        <span className="stat-value">{customers.length}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Total Orders</span>
                        <span className="stat-value">
                            {customers.reduce((sum, c) => sum + c.total_orders, 0)}
                        </span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Total Revenue</span>
                        <span className="stat-value">
                            ₹{customers.reduce((sum, c) => sum + c.total_spent, 0).toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            <div className="customers-table-container">
                <table className="customers-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Mobile</th>
                            <th>Email</th>
                            <th>Table</th>
                            <th>Orders</th>
                            <th>Total Spent</th>
                            <th>Last Visit</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer) => (
                            <tr key={customer.id}>
                                <td>
                                    <div className="customer-name">
                                        {customer.name}
                                        {!customer.email && <span className="guest-badge">Guest</span>}
                                    </div>
                                </td>
                                <td>{customer.mobile}</td>
                                <td>{customer.email || "—"}</td>
                                <td>
                                    <span className="table-badge">Table {customer.table_number}</span>
                                </td>
                                <td>{customer.total_orders}</td>
                                <td className="amount">₹{customer.total_spent.toLocaleString()}</td>
                                <td>{new Date(customer.last_visit).toLocaleString()}</td>
                                <td>
                                    <button
                                        className="view-btn"
                                        onClick={() => setSelectedCustomer(customer)}
                                    >
                                        👁️ View History
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedCustomer && (
                <div className="modal-overlay" onClick={() => setSelectedCustomer(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Customer Details</h2>
                        <div className="customer-details">
                            <div className="detail-row">
                                <span>Name:</span>
                                <span>{selectedCustomer.name}</span>
                            </div>
                            <div className="detail-row">
                                <span>Mobile:</span>
                                <span>{selectedCustomer.mobile}</span>
                            </div>
                            <div className="detail-row">
                                <span>Email:</span>
                                <span>{selectedCustomer.email || "Not provided"}</span>
                            </div>
                            <div className="detail-row">
                                <span>Total Orders:</span>
                                <span>{selectedCustomer.total_orders}</span>
                            </div>
                            <div className="detail-row">
                                <span>Total Spent:</span>
                                <span className="amount">₹{selectedCustomer.total_spent.toLocaleString()}</span>
                            </div>
                        </div>

                        <h3>Order History</h3>
                        <div className="order-history">
                            {selectedCustomer.orders.map((order) => (
                                <div key={order.id} className="history-item">
                                    <div className="history-info">
                                        <span className="order-id">Order #{order.id}</span>
                                        <span className="order-date">{order.date}</span>
                                    </div>
                                    <div className="history-details">
                                        <span>{order.items} items</span>
                                        <span className="amount">₹{order.amount}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="close-btn" onClick={() => setSelectedCustomer(null)}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
