import React, { useState } from "react";

const AddItem = () => {
  const [itemType, setItemType] = useState("Card");
  const [formData, setFormData] = useState({
    name: "",
    set: "",
    number: "",
    condition: "NM",
    company: "",
    grade: "",
    purchasePrice: "",
    purchaseDate: "",
    soldPrice: "",
    soldDate: "",
    notes: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Build payload based on type
    let payload = { itemType, ...formData };

    // Remove irrelevant fields
    if (itemType === "Card") {
      delete payload.company;
      delete payload.grade;
    } else if (itemType === "Slab") {
      delete payload.condition;
    } else if (itemType === "Sealed") {
      delete payload.set;
      delete payload.number;
      delete payload.condition;
      delete payload.company;
      delete payload.grade;
    }

    try {
      const res = await fetch("http://localhost:5000/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Item added successfully!");
        setFormData({
          name: "",
          set: "",
          number: "",
          condition: "NM",
          company: "",
          grade: "",
          purchasePrice: "",
          purchaseDate: "",
          soldPrice: "",
          soldDate: "",
          notes: "",
        });
      } else {
        setMessage("Error: " + data.error);
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add New Item</h2>

      <form onSubmit={handleSubmit}>
        {/* Select item type */}
        <div style={{ marginBottom: "10px" }}>
          <label>
            Item Type:
            <select
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
              style={{ marginLeft: "10px" }}
            >
              <option value="Card">Card</option>
              <option value="Slab">Slab</option>
              <option value="Sealed">Sealed</option>
            </select>
          </label>
        </div>

        {/* Name */}
        <div style={{ marginBottom: "10px" }}>
          <label>
            Name:{" "}
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        {/* Fields for Card and Slab */}
        {(itemType === "Card" || itemType === "Slab") && (
          <>
            <div style={{ marginBottom: "10px" }}>
              <label>
                Set:{" "}
                <input
                  name="set"
                  value={formData.set}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>
                Number:{" "}
                <input
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                />
              </label>
            </div>
          </>
        )}

        {/* Condition for Card */}
        {itemType === "Card" && (
          <div style={{ marginBottom: "10px" }}>
            <label>
              Condition:
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
              >
                <option value="NM">NM</option>
                <option value="LP">LP</option>
                <option value="MP">MP</option>
                <option value="HP">HP</option>
                <option value="D">D</option>
              </select>
            </label>
          </div>
        )}

        {/* Slab specific fields */}
        {itemType === "Slab" && (
          <>
            <div style={{ marginBottom: "10px" }}>
              <label>
                Company:{" "}
                <input
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>
                Grade:{" "}
                <input
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                />
              </label>
            </div>
          </>
        )}

        {/* Purchase info */}
        <div style={{ marginBottom: "10px" }}>
          <label>
            Purchase Price:{" "}
            <input
              type="number"
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>
            Purchase Date:{" "}
            <input
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
            />
          </label>
        </div>

        {/* Sold info */}
        <div style={{ marginBottom: "10px" }}>
          <label>
            Sold Price:{" "}
            <input
              type="number"
              name="soldPrice"
              value={formData.soldPrice}
              onChange={handleChange}
            />
          </label>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>
            Sold Date:{" "}
            <input
              type="date"
              name="soldDate"
              value={formData.soldDate}
              onChange={handleChange}
            />
          </label>
        </div>

        {/* Notes */}
        <div style={{ marginBottom: "10px" }}>
          <label>
            Notes:{" "}
            <input
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </label>
        </div>

        <button type="submit">Add Item</button>
      </form>

      {message && <p style={{ marginTop: "20px" }}>{message}</p>}
    </div>
  );
};

export default AddItem;
