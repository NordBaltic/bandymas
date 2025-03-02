import React from 'react';
import Link from 'next/link';

const Home = () => {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Welcome to NordBalticum</h1>
            <p>Your gateway to a premium Web3 financial ecosystem.</p>
            <Link href="/profile">
                <button style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}>
                    Go to Profile
                </button>
            </Link>
        </div>
    );
};

export default Home;
