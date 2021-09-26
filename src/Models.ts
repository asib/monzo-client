export interface Account {
    id: string,
    description: string,
    created: Date,
};

export interface Transaction {
    amount: number,
    created: Date,
    currency: string,
    description: string,
}