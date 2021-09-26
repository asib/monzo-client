import { Writable, writable, derived } from "svelte/store";
import { Transaction } from "./Models";

export const searchTerm: Writable<string> = writable("");
export const caseSensitiveSearch: Writable<boolean> = writable(false);
export const transactions: Writable<Array<Transaction>> = writable();

export const filteredTransactions = derived([searchTerm, caseSensitiveSearch, transactions], ([$searchTerm, $caseSensitiveSearch, $transactions]) => {
    if (!$transactions)
        return null;
    
    return $transactions.filter(filterBySearch($caseSensitiveSearch)($searchTerm));
});

const filterBySearch = (caseSensitive: boolean): (searchTerm: string) => (transaction: Transaction) => boolean => {
    return caseSensitive ? filterBySearchCaseSensitive : filterBySearchCaseInsensitive;
}

const filterBySearchCaseInsensitive = (searchTerm) => (transaction) => transaction.description.includes(searchTerm);
const filterBySearchCaseSensitive = (searchTerm) => (transaction) => transaction.description.match(new RegExp(searchTerm, "i"));