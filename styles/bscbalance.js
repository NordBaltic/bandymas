.bsc-balance-container {
    text-align: center;
    padding: 20px;
    max-width: 300px;
    margin: auto;
    border-radius: 12px;
    backdrop-filter: blur(12px);
    border: 2px solid var(--glass-border);
    box-shadow: 0px 4px 15px var(--shadow-glow);
    transition: all 0.3s ease-in-out;
}

.bsc-balance-container:hover {
    box-shadow: 0px 6px 20px rgba(181, 148, 16, 0.4);
}

.bsc-title {
    font-size: 20px;
    font-weight: bold;
    color: var(--accent-color);
    margin-bottom: 10px;
    text-shadow: 0px 0px 10px var(--shadow-glow);
}

.bsc-balance {
    font-size: 24px;
    font-weight: bold;
    color: var(--text-color);
}

.loading-animation {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--accent-color);
    box-shadow: 0px 0px 12px var(--shadow-glow);
    animation: pulse 1.5s infinite alternate;
}

@keyframes pulse {
    from { transform: scale(1); opacity: 1; }
    to { transform: scale(1.2); opacity: 0.8; }
}
