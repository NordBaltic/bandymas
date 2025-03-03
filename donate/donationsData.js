export const ADMIN_DONATION_WALLET = process.env.NEXT_PUBLIC_ADMIN_DONATION_WALLET;

export const DONATION_FUNDS = [
    {
        name: "Red Cross",
        description: "Helping people in need worldwide with emergency aid and disaster relief.",
        wallet: "0x1234567890abcdef1234567890abcdef12345678",
        image: "/images/redcross.jpg",
    },
    {
        name: "UNICEF",
        description: "Supporting children's education, healthcare, and welfare globally.",
        wallet: "0xabcdef1234567890abcdef1234567890abcdef12",
        image: "/images/unicef.jpg",
    },
    {
        name: "Save the Children",
        description: "Providing education, healthcare, and emergency aid for children worldwide.",
        wallet: "0x7890abcdef1234567890abcdef1234567890abcd",
        image: "/images/savethechildren.jpg",
    }
];
