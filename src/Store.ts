import { Writable, writable, derived } from "svelte/store";
import type { Transaction } from "./Models";

export const formatCreatedDate = (date: Date): string => {
    return `${date.toLocaleDateString("en-GB")} ${date.toLocaleTimeString("en-GB")}`;
}

export const searchTerm: Writable<string> = writable("");
export const caseSensitiveSearch: Writable<boolean> = writable(false);
export const transactions: Writable<Array<Transaction>> = writable();

export const filteredTransactions = derived([searchTerm, caseSensitiveSearch, transactions], ([$searchTerm, $caseSensitiveSearch, $transactions]) => {
    if (!$transactions)
        return null;

    const caseSensitiveAwareFilters = filterBySearch($caseSensitiveSearch);
    const searchTerms = $searchTerm.split(" ");

    // This will filter the list of transactions down to only those for which all
    // search terms match at least on the filters returned by filterBySearch().
    const matchAnyTermFilter = (transaction: Transaction): boolean => {
        return searchTerms.reduce<boolean>((acc, term, _ix, _array) => {
            if (!acc)
                return false;

            return caseSensitiveAwareFilters.reduce<boolean>((acc, filter, _ix, _array) => {
                if (acc)
                    return true;

                return filter(term)(transaction);
            }, false);
        }, true);
    }

    return $transactions.filter(matchAnyTermFilter);
});

const filterBySearch = (caseSensitive: boolean): Array<(searchTerm: string) => (transaction: Transaction) => boolean> => {
    return [
        (caseSensitive ? filterByDescriptionCaseSensitive : filterByDescriptionCaseInsensitive),
        filterByAmount,
        filterByDate,
    ]
}

const filterByDescriptionCaseSensitive = (searchTerm: string) => (transaction: Transaction) => transaction.description.includes(searchTerm);
const filterByDescriptionCaseInsensitive = (searchTerm: string) => (transaction: Transaction) => {
    const matches = transaction.description.match(new RegExp(searchTerm, "i"));
    
    return (matches && matches.length > 0);
};

const filterByAmount = (searchTerm: string) => (transaction: Transaction) => transaction.amount.toString().includes(searchTerm);
const filterByDate = (searchTerm: string) => (transaction: Transaction) => formatCreatedDate(transaction.created).includes(searchTerm);