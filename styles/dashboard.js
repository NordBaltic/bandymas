/* === 💎 DASHBOARD STYLES === */
.dashboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  animation: fadeInScale 1.5s ease-in-out;
}

/* === 🔥 DASHBOARD BOX === */
.dashboard-box {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(18px);
  padding: 50px;
  border-radius: 20px;
  box-shadow: 0px 0px 40px rgba(255, 215, 0, 0.6);
  border: 2px solid var(--gold-color);
  transition: all 0.3s ease-in-out;
  width: 90%;
  max-width: 500px;
}

/* === 🔥 WALLET INFO === */
.wallet-info {
  margin-top: 20px;
  font-size: 18px;
  color: white;
  font-weight: bold;
}

.wallet-label {
  font-size: 20px;
  font-weight: bold;
  color: var(--gold-color);
}

.wallet-address {
  font-size: 16px;
  font-family: monospace;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
}

/* === 🔥 LOGOUT BUTTON === */
.logout-button {
  margin-top: 30px;
  padding: 15px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 12px;
  border: none;
  background: linear-gradient(145deg, #9C7400, #FFD700);
  color: #000;
  box-shadow: 0px 7px 20px rgba(156, 116, 0, 0.6);
  transition: all 0.3s ease-in-out;
  width: 100%;
  max-width: 300px;
}

.logout-button:hover {
  transform: scale(1.08);
  box-shadow: 0px 15px 40px rgba(156, 116, 0, 1);
}
