import React, { useEffect, useState } from "react";

const ItemsTable = () => {
  const [items, setItems] = useState([]);
  const [showSold, setShowSold] = useState(false);
  const [typeFilter, setTypeFilter] = useState("All");
  const [editingItemId, setEditingItemId] = useState(null);
  const [soldData, setSoldData] = useState({
    soldPrice: "",
    soldDate: "",
    notes: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    const res = await fetch("http://localhost:5000/api/items");
    const data = await res.json();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleEditChange = (e) => {
    setSoldData({ ...soldData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (itemId) => {
    await fetch(`http://localhost:5000/api/items/${itemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(soldData),
    });
    setEditingItemId(null);
    setSoldData({ soldPrice: "", soldDate: "", notes: "" });
    fetchItems();
  };

  if (loading) return <p>Loading...</p>;

  const filteredItems = items.filter((item) => {
    const soldCondition = showSold || item.soldPrice == null;
    const typeCondition = typeFilter === "All" || item.itemType === typeFilter;
    return soldCondition && typeCondition;
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2>Inventory</h2>

      {/* Filters */}
      <div style={{ marginBottom: "10px" }}>
        <button
          onClick={() => setShowSold((prev) => !prev)}
          style={{ marginRight: "10px" }}
        >
          {showSold ? "Hide Sold Items" : "Show Sold Items"}
        </button>

        <label>
          Filter by Type:{" "}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Card">Card</option>
            <option value="Slab">Slab</option>
            <option value="Sealed">Sealed</option>
          </select>
        </label>
      </div>

      {/* Table */}
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Type</th>
            <th>Name</th>
            <th>Set</th>
            <th>Number</th>
            <th>Condition</th>
            <th>Company</th>
            <th>Grade</th>
            <th>Purchase Price</th>
            <th>Purchase Date</th>
            <th>Sold Price</th>
            <th>Sold Date</th>
            <th>Notes</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item._id}>
              <td>{item.itemType}</td>
              <td>{item.name}</td>
              <td>{item.set || "-"}</td>
              <td>{item.number || "-"}</td>
              <td>{item.condition || "-"}</td>
              <td>{item.company || "-"}</td>
              <td>{item.grade || "-"}</td>
              <td>${item.purchasePrice}</td>
              <td>
                {item.purchaseDate
                  ? new Date(item.purchaseDate).toLocaleDateString()
                  : "-"}
              </td>
              <td>
                {editingItemId === item._id ? (
                  <input
                    type="number"
                    name="soldPrice"
                    value={soldData.soldPrice}
                    onChange={handleEditChange}
                  />
                ) : item.soldPrice != null ? (
                  `$${item.soldPrice}`
                ) : (
                  "-"
                )}
              </td>
              <td>
                {editingItemId === item._id ? (
                  <input
                    type="date"
                    name="soldDate"
                    value={soldData.soldDate}
                    onChange={handleEditChange}
                  />
                ) : item.soldDate ? (
                  new Date(item.soldDate).toLocaleDateString()
                ) : (
                  "-"
                )}
              </td>
              <td>
                {editingItemId === item._id ? (
                  <input
                    type="text"
                    name="notes"
                    value={soldData.notes}
                    onChange={handleEditChange}
                  />
                ) : (
                  item.notes || "-"
                )}
              </td>
              <td>
                {item.soldPrice == null ? (
                  editingItemId === item._id ? (
                    <>
                      <button onClick={() => handleSubmit(item._id)}>
                        Save
                      </button>
                      <button onClick={() => setEditingItemId(null)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setEditingItemId(item._id)}>
                      Mark as Sold
                    </button>
                  )
                ) : (
                  "Sold"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemsTable;
