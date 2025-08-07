import React from "react";

export default function Settings() {
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

  return (
    <div style={pageStyle}>
      <h2 style={{ color: "#113F67", marginBottom: "30px" }}>Settings</h2>

      {/* User Profile */}
      <div style={cardStyle}>
        <h5 style={sectionTitleStyle}>User Profile</h5>
        <form>
          <div style={rowStyle}>
            <div style={colStyle}>
              <label style={labelStyle}>Full Name</label>
              <input type="text" value="Santhosh Kumar" disabled style={inputStyle} />
            </div>
            <div style={colStyle}>
              <label style={labelStyle}>Email</label>
              <input type="email" value="santhoshdives@yahoo.com" disabled style={inputStyle} />
            </div>
          </div>

          <div style={rowStyle}>
            <div style={colStyle}>
              <label style={labelStyle}>Phone Number</label>
              <input type="text" value="+1 (555) 123-4567" disabled style={inputStyle} />
            </div>
            <div style={colStyle}>
              <label style={labelStyle}>Date of Birth</label>
              <input type="date" value="2002-01-01" disabled style={inputStyle} />
            </div>
          </div>

          <div style={rowStyle}>
            <div style={colStyle}>
              <label style={labelStyle}>Address</label>
              <input type="text" value="123 Wall Street, NY" disabled style={inputStyle} />
            </div>
            <div style={colStyle}>
              <label style={labelStyle}>ZIP Code</label>
              <input type="text" value="10005" disabled style={inputStyle} />
            </div>
            <div style={colStyle}>
              <label style={labelStyle}>State</label>
              <input type="text" value="New York" disabled style={inputStyle} />
            </div>
          </div>
        </form>
      </div>

      {/* Investment/Brokerage Details */}
      <div style={cardStyle}>
        <h5 style={sectionTitleStyle}>Investment Account Details</h5>
        <form>
          <div style={rowStyle}>
            <div style={colStyle}>
              <label style={labelStyle}>Brokerage Account Number</label>
              <input type="text" value="98765432100" disabled style={inputStyle} />
            </div>
            <div style={colStyle}>
              <label style={labelStyle}>SSN (Last 4 digits)</label>
              <input type="text" value="1234" disabled style={inputStyle} />
            </div>
          </div>
        </form>
      </div>

      {/* Bank Details */}
      <div style={cardStyle}>
        <h5 style={sectionTitleStyle}>Bank Details</h5>
        <form>
          <div style={rowStyle}>
            <div style={colStyle}>
              <label style={labelStyle}>Bank Account Number</label>
              <input type="text" value="001234567890" disabled style={inputStyle} />
            </div>
            <div style={colStyle}>
              <label style={labelStyle}>Routing Number</label>
              <input type="text" value="026009593" disabled style={inputStyle} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
