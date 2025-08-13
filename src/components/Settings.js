import React, { useEffect, useState } from "react";
import  axios from "axios";


export default function Settings() {
  const [user, setUser] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    date_of_birth: "",
    address: "",
    zip_code: "",
    state: "",
    demat_number: "",
    client_number: "",
    bank_account_number: "",
    ifsc_code: "",
  });

  const [editMode, setEditMode] = useState({
    full_name: false,
    email: false,
    phone_number: false,
    date_of_birth: false,
    address: false,
    zip_code: false,
    state: false,
    bank_account_number: false,
    ifsc_code: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
  async function fetchUser() {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/useraccount/getAccountInfo", {
        params: { userId: 1 }
      });
      const data = res.data || {};
      setUser({
        full_name: data.fullName || "",
        email: data.email || "",
        phone_number: data.phoneNumber || "",
        date_of_birth: data.dateOfBirth
          ? new Date(data.dateOfBirth).toISOString().slice(0, 10)
          : "",
        address: data.address || "",
        zip_code: data.zipCode ? String(data.zipCode) : "",
        state: data.state || "",
        demat_number: data.dematNumber || "",
        client_number: data.clientNumber || "",
        bank_account_number: data.bankAccountNumber ? String(data.bankAccountNumber) : "",
        ifsc_code: data.ifscCode || "",
      });
    } catch (err) {
      alert("Failed to fetch user info");
    } finally {
      setLoading(false);
    }
  }
  fetchUser();
}, []);

  const handleEdit = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post("http://localhost:8080/useraccount/updateInfo", null, {
        params: {
          userId: 1,
          fullName: user.full_name,
          email: user.email,
          phoneNumber: user.phone_number,
          address: user.address,
          zipCode: user.zip_code,
          state: user.state,
          bankAccountNumber: user.bank_account_number,
          ifscCode: user.ifsc_code,
        }
      });
      alert("Profile updated!");
      setEditMode({
        full_name: false,
        email: false,
        phone_number: false,
        date_of_birth: false,
        address: false,
        zip_code: false,
        state: false,
        bank_account_number: false,
        ifsc_code: false,
      });
    } catch (err) {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const pageStyle = {
    marginLeft: "250px",
    padding: "20px",
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    fontFamily: "sans-serif",
  };

  const cardStyle = {
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    border: "none",
    backgroundColor: "white",
    padding: "20px",
    marginBottom: "30px",
  };

  const sectionTitleStyle = {
    fontWeight: "600",
    fontSize: "18px",
    marginBottom: "16px",
    color: "#113F67",
  };

  const labelStyle = {
    fontWeight: "500",
    color: "#113F67",
    display: "block",
    marginBottom: "6px",
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    marginBottom: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    backgroundColor: "#f1f1f1",
  };

  const rowStyle = {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  };

  const colStyle = {
    flex: "1",
    minWidth: "250px",
  };

  const editIconStyle = {
    cursor: "pointer",
    marginLeft: "8px",
    color: "#007bff",
    fontSize: "16px",
    verticalAlign: "middle"
  };

  return (
    <div style={pageStyle}>
 <h2
  style={{
    color: "#113F67",
    marginBottom: "30px",
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue','sans-serif'`,
    textAlign: "center",
    fontWeight: "700",
    fontSize: "2.5rem",
  }}
>
  Settings
</h2>


      {/* User Profile */}
      <div style={cardStyle}>
        <h5 style={sectionTitleStyle}>User Profile</h5>
        <form onSubmit={handleUpdate}>
          <div style={rowStyle}>
            <div style={colStyle}>
              <label style={labelStyle}>
                Full Name
                {!editMode.full_name && (
                  <span style={editIconStyle} onClick={() => handleEdit("full_name")} title="Edit">&#9998;</span>
                )}
              </label>
              <input
                type="text"
                value={user.full_name}
                disabled={!editMode.full_name || loading}
                style={inputStyle}
                onChange={e => handleChange("full_name", e.target.value)}
              />
            </div>
            <div style={colStyle}>
              <label style={labelStyle}>
                Email
                {!editMode.email && (
                  <span style={editIconStyle} onClick={() => handleEdit("email")} title="Edit">&#9998;</span>
                )}
              </label>
              <input
                type="email"
                value={user.email}
                disabled={!editMode.email || loading}
                style={inputStyle}
                onChange={e => handleChange("email", e.target.value)}
              />
            </div>
          </div>

          <div style={rowStyle}>
            <div style={colStyle}>
              <label style={labelStyle}>
                Phone Number
                {!editMode.phone_number && (
                  <span style={editIconStyle} onClick={() => handleEdit("phone_number")} title="Edit">&#9998;</span>
                )}
              </label>
              <input
                type="text"
                value={user.phone_number}
                disabled={!editMode.phone_number || loading}
                style={inputStyle}
                onChange={e => handleChange("phone_number", e.target.value)}
              />
            </div>
            <div style={colStyle}>
              <label style={labelStyle}>
                Date of Birth
                {/* {!editMode.date_of_birth && (
                  <span style={editIconStyle} onClick={() => handleEdit("date_of_birth")} title="Edit">&#9998;</span>
                )} */}
              </label>
              <input
                type="date"
                value={user.date_of_birth}
                disabled
                style={inputStyle}
              />
            </div>
          </div>

          <div style={rowStyle}>
            <div style={colStyle}>
              <label style={labelStyle}>
                Address
                {!editMode.address && (
                  <span style={editIconStyle} onClick={() => handleEdit("address")} title="Edit">&#9998;</span>
                )}
              </label>
              <input
                type="text"
                value={user.address}
                disabled={!editMode.address || loading}
                style={inputStyle}
                onChange={e => handleChange("address", e.target.value)}
              />
            </div>
            <div style={colStyle}>
              <label style={labelStyle}>
                ZIP Code
                {!editMode.zip_code && (
                  <span style={editIconStyle} onClick={() => handleEdit("zip_code")} title="Edit">&#9998;</span>
                )}
              </label>
              <input
                type="text"
                value={user.zip_code}
                disabled={!editMode.zip_code || loading}
                style={inputStyle}
                onChange={e => handleChange("zip_code", e.target.value)}
              />
            </div>
            <div style={colStyle}>
              <label style={labelStyle}>
                State
                {!editMode.state && (
                  <span style={editIconStyle} onClick={() => handleEdit("state")} title="Edit">&#9998;</span>
                )}
              </label>
              <input
                type="text"
                value={user.state}
                disabled={!editMode.state || loading}
                style={inputStyle}
                onChange={e => handleChange("state", e.target.value)}
              />
            </div>
          </div>

          {/* Investment/Brokerage Details */}
          <div style={cardStyle}>
            <h5 style={sectionTitleStyle}>Investment Account Details</h5>
            <div style={rowStyle}>
              <div style={colStyle}>
                <label style={labelStyle}>Demat Number</label>
                <input
                  type="text"
                  value={user.demat_number}
                  disabled
                  style={inputStyle}
                />
              </div>
              <div style={colStyle}>
                <label style={labelStyle}>Client Number</label>
                <input
                  type="text"
                  value={user.client_number}
                  disabled
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div style={cardStyle}>
            <h5 style={sectionTitleStyle}>Bank Details</h5>
            <div style={rowStyle}>
              <div style={colStyle}>
                <label style={labelStyle}>
                  Bank Account Number
                  {!editMode.bank_account_number && (
                    <span style={editIconStyle} onClick={() => handleEdit("bank_account_number")} title="Edit">&#9998;</span>
                  )}
                </label>
                <input
                  type="text"
                  value={user.bank_account_number}
                  disabled={!editMode.bank_account_number || loading}
                  style={inputStyle}
                  onChange={e => handleChange("bank_account_number", e.target.value)}
                />
              </div>
              <div style={colStyle}>
                <label style={labelStyle}>
                  IFSC Code
                  {!editMode.ifsc_code && (
                    <span style={editIconStyle} onClick={() => handleEdit("ifsc_code")} title="Edit">&#9998;</span>
                  )}
                </label>
                <input
                  type="text"
                  value={user.ifsc_code}
                  disabled={!editMode.ifsc_code || loading}
                  style={inputStyle}
                  onChange={e => handleChange("ifsc_code", e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            style={{
              marginTop: "20px",
              padding: "10px 30px",
              backgroundColor: "#113F67",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer"
            }}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
}