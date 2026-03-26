import API_BASE_URL from "./apiConfig";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import "./adminTables.css";

export default function AdminTables() {
    const [tables, setTables] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingTable, setEditingTable] = useState(null);
    const [formData, setFormData] = useState({
        table_number: "",
        capacity: 4,
        status: "available",
    });

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            const res = await axios.get(API_BASE_URL + "/api/tables");
            setTables(res.data);
        } catch (err) {
            console.error("Error fetching tables:", err);
        }
    };

    const availableCount = tables.filter(t => (t.status || 'available').toLowerCase() === "available").length;
    const occupiedCount = tables.filter(t => (t.status || '').toLowerCase() === "occupied").length;

    const data = [
        { name: 'Available', value: availableCount, color: '#4ade80' },
        { name: 'Occupied', value: occupiedCount, color: '#ef4444' },
    ];

    const handleAddNew = () => {
        setEditingTable(null);
        setFormData({ table_number: "", capacity: 4, status: "available" });
        setShowModal(true);
    };

    const handleEdit = (table) => {
        setEditingTable(table);
        setFormData({
            table_number: table.table_number,
            capacity: table.capacity,
            status: table.status?.toLowerCase() || "available",
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this table?")) {
            try {
                await axios.delete(`${API_BASE_URL}/api/tables/${id}`);
                fetchTables();
            } catch (err) {
                console.error("Error deleting table:", err);
                alert("Failed to delete table");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTable) {
                await axios.put(`${API_BASE_URL}/api/tables/${editingTable.id}/status`, {
                    status: formData.status
                });
            } else {
                await axios.post(API_BASE_URL + "/api/tables", {
                    table_number: formData.table_number,
                    capacity: formData.capacity
                });
            }
            fetchTables();
            setShowModal(false);
        } catch (err) {
            console.error("Error saving table:", err);
            alert("Failed to save table. Table number might exist.");
        }
    };

    const downloadQR = (tableId, tableNumber, qrUrl) => {
        if (qrUrl) {
            const link = document.createElement("a");
            link.href = qrUrl;
            link.download = `table-${tableNumber}-qr.png`;
            link.click();
        }
    };

    const setStatus = async (tableId, status) => {
        try {
            await axios.put(`${API_BASE_URL}/api/tables/${tableId}/status`, {
                status: status
            });
            fetchTables();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="admin-tables">
            <div className="tables-header">
                <div className="stats-row">
                    <div className="stat-card">
                        <span className="stat-label">Total Tables</span>
                        <span className="stat-value">{tables.length}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Available</span>
                        <span className="stat-value available">{availableCount}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Occupied</span>
                        <span className="stat-value occupied">{occupiedCount}</span>
                    </div>
                </div>
                <button className="add-table-btn" onClick={handleAddNew}>
                    ➕ Add New Table
                </button>
            </div>

            <div className="tables-chart-section" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ margin: '0 0 15px 0', color: 'var(--accent-cream)' }}>📊 Seating Occupancy</h3>
                <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="tables-grid">
                {tables.map((table) => (
                    <div key={table.id} className={`table-card ${table.status?.toLowerCase()}`}>
                        <div className="table-card-header">
                            <h3>Table {table.table_number}</h3>
                            <span className={`status-badge ${table.status?.toLowerCase()}`}>
                                {table.status?.toLowerCase() === "occupied" ? "🔴 Occupied" : "🟢 Available"}
                            </span>
                        </div>

                        <div className="qr-section">
                            {table.qr_code ? (
                                <img src={table.qr_code} alt={`QR Code for Table ${table.table_number}`} />
                            ) : (
                                <div className="no-qr">No QR</div>
                            )}
                        </div>

                        <div className="table-info">
                            <div className="info-row">
                                <span>Capacity:</span>
                                <span>{table.capacity} persons</span>
                            </div>
                        </div>

                        <div className="table-actions">
                            <div className="occupancy-toggles" style={{ marginBottom: '10px', display: 'flex', gap: '5px' }}>
                                <button 
                                    className={`action-btn ${table.status?.toLowerCase() === 'occupied' ? 'active-red' : ''}`}
                                    onClick={() => setStatus(table.id, 'occupied')}
                                    style={{ flex: 1, backgroundColor: table.status?.toLowerCase() === 'occupied' ? '#ef4444' : 'rgba(239, 68, 68, 0.1)', color: table.status?.toLowerCase() === 'occupied' ? '#fff' : '#ef4444', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}
                                >
                                    Occupied
                                </button>
                                <button 
                                    className={`action-btn ${table.status?.toLowerCase() !== 'occupied' ? 'active-green' : ''}`}
                                    onClick={() => setStatus(table.id, 'available')}
                                    style={{ flex: 1, backgroundColor: table.status?.toLowerCase() !== 'occupied' ? '#4ade80' : 'rgba(74, 222, 128, 0.1)', color: table.status?.toLowerCase() !== 'occupied' ? '#000' : '#4ade80', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}
                                >
                                    Available
                                </button>
                            </div>
                            
                            {table.qr_code && (
                                <button className="action-btn download" onClick={() => downloadQR(table.id, table.table_number, table.qr_code)} style={{ width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '6px' }}>
                                    ⬇️ Download QR
                                </button>
                            )}
                            
                            <div className="action-btns-secondary" style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                                <button className="action-btn edit" onClick={() => handleEdit(table)} title="Edit">✏️</button>
                                <button className="action-btn delete" onClick={() => handleDelete(table.id)} title="Delete">🗑️</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{editingTable ? "Edit Table" : "Add New Table"}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Table Number *</label>
                                <input
                                    type="number"
                                    value={formData.table_number}
                                    onChange={(e) => setFormData({ ...formData, table_number: e.target.value })}
                                    required
                                    disabled={!!editingTable}
                                />
                            </div>

                            <div className="form-group">
                                <label>Capacity (Persons) *</label>
                                <input
                                    type="number"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                    required
                                    min="1"
                                    max="20"
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="submit-btn" style={{ background: '#4ade80', color: '#000' }}>
                                    {editingTable ? "Update" : "Add Table"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
