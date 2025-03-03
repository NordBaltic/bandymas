/* === 🔥 WALLET CONNECT BUTTON - PREMIUM UI === */
.wallet-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0px 6px 20px rgba(181, 148, 16, 0.3);
  backdrop-filter: blur(15px);
  transition: all 0.3s ease-in-out;
  max-width: 300px;
  margin: auto;
  text-align: center;
}

.wallet-container:hover {
  box-shadow: 0px 8px 25px rgba(181, 148, 16, 0.5);
  transform: scale(1.02);
}

/* === ✅ CONNECTION STATUS === */
.status-text {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: var(--accent-color);
  text-shadow: 0px 0px 10px rgba(255, 215, 0, 0.7);
}

/* === 🔹 CONNECTED WALLET ADDRESS === */
.wallet-address {
  font-size: 15px;
  font-weight: bold;
  color: var(--text-color);
  background: rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 10px;
  text-shadow: 0px 0px 8px rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease-in-out;
}

/* === 🔥 CONNECT/DISCONNECT BUTTONS === */
.wallet-button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 10px;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0px 6px 18px var(--shadow-glow);
  margin-top: 15px;
}

.connect {
  background: linear-gradient(135deg, #2D88FF, #3B3B98);
  color: white;
}

.connect:hover {
  background: linear-gradient(135deg, #3B3B98, #2D88FF);
  transform: scale(1.05);
}

.logout {
  background: linear-gradient(135deg, #D40000, #FF4C4C);
  color: white;
}

.logout:hover {
  background: linear-gradient(135deg, #FF4C4C, #D40000);
  transform: scale(1.05);
}

/* === 🔹 BUTTON ICON STYLES === */
.button-icon {
  width: 18px;
  height: 18px;
  filter: drop-shadow(0px 0px 6px rgba(255, 255, 255, 0.6));
}

/* === 📱 RESPONSIVE FIXES === */
@media (max-width: 768px) {
  .wallet-container {
    max-width: 90%;
    padding: 20px;
  }

  .wallet-button {
    font-size: 15px;
  }
}
