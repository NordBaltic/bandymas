import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWeb3 } from '../hooks/useWeb3';
import { donateToCharity } from '../lib/donate';

const CHARITIES = [
    {
        name: "Red Cross",
        description: "Providing humanitarian aid worldwide.",
        image: "/images/redcross.jpg"
    },
    {
        name: "Children’s Foundation",
        description: "Helping children in need worldwide.",
        image: "/images/children.jpg"
    },
    {
        name: "Nature Protection Fund",
        description: "Protecting the environment and wildlife.",
        image: "/images/nature.jpg"
    }
];

export default function Donate() {
    const { active, account } = useWeb3();
    const [amount, setAmount] = useState('');
    const [selectedCharity, setSelectedCharity] = useState(null);

    const handleDonate = async (charity) => {
        if (!active || !account) {
            alert("Prijunkite piniginę prieš aukojant.");
            return;
        }
        const success = await donateToCharity(account, parseFloat(amount), charity);
        if (success) alert(`Sėkmingai paaukojote ${amount} BNB į ${charity}!`);
    };

    return (
        <motion.div className="donate-container fade-in">
            <h2>Support a Cause</h2>

            <div className="charity-list">
                {CHARITIES.map((charity) => (
                    <motion.div
                        key={charity.name}
                        className="charity-card"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setSelectedCharity(charity.name)}
                    >
                        <img src={charity.image} alt={charity.name} className="charity-image"/>
                        <h3>{charity.name}</h3>
                        <p>{charity.description}</p>
                        <input
                            type="number"
                            placeholder="Kiekis BNB"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <button className="donate-btn" onClick={() => handleDonate(charity.name)}>
                            Aukoti {charity.name}
                        </button>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
