// components/SendBscTransaction.js
import { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../hooks/useWeb3';

export default function SendBscTransaction({ senderAddress }) {
    const [to, setTo] = useState('');
    const [amount, setAmount] = useState('');

    const sendTransaction = async () => {
        if (!senderAddress) {
            alert("Jūs neturite priskirtos BSC piniginės!");
            return;
        }

        const provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
        const signer = new ethers.Wallet("PRIVATE_KEY_HERE", provider); // čia vietoje reikia gauti iš Supabase

        const adminFee = (parseFloat(amount) * 0.002).toFixed(4); // 0.2% fee
        const finalAmount = (parseFloat(amount) - parseFloat(adminFee)).toFixed(4);

        const tx = {
            to,
            value: ethers.utils.parseEther(finalAmount),
        };

        try {
            const transaction = await signer.sendTransaction(tx);
            await transaction.wait();
            alert(`Transakcija sėkminga! Išsiųsta: ${finalAmount} BNB (0.2% fee: ${adminFee} BNB)`);
        } catch (error) {
            console.error("BSC Transaction Error:", error);
            alert("Transakcija nepavyko.");
        }
    };

    return (
        <div className="send-container">
            <h3>Siųsti BNB</h3>
            <input type="text" placeholder="Gavėjo adresas" value={to} onChange={(e) => setTo(e.target.value)} />
            <input type="text" placeholder="Kiekis BNB" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <button onClick={sendTransaction}>Siųsti</button>
        </div>
    );
}
