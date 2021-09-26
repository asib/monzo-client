import { Writable, writable, derived } from "svelte/store";
import type { Transaction } from "./Models";

export const formatCreatedDate = (date: Date): string => {
    return `${date.toLocaleDateString("en-GB")} ${date.toLocaleTimeString("en-GB")}`;
}

const createDateTimeFrom = (date: Date, time: Date): Date => {
    let dateTime: Date | null = null;
    if (date) {
        dateTime = new Date(date);
        if (time) {
            dateTime.setHours(time.getHours(), time.getMinutes(), time.getSeconds());
        }
    }

    return dateTime;
}

export const searchTerm: Writable<string> = writable("");
export const caseSensitiveSearch: Writable<boolean> = writable(false);
export const startDate: Writable<Date | null> = writable();
export const endDate: Writable<Date | null> = writable();
export const startTime: Writable<Date | null> = writable();
export const endTime: Writable<Date | null> = writable();

export const transactions: Writable<Array<Transaction>> = writable();

export const filteredTransactions = derived([searchTerm, caseSensitiveSearch, startDate, startTime, endDate, endTime, transactions], ([$searchTerm, $caseSensitiveSearch, $startDate, $startTime, $endDate, $endTime, $transactions]) => {
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

    const startDateTime = createDateTimeFrom($startDate, $startTime);
    const endDateTime = createDateTimeFrom($endDate, $endTime);

    let result = $transactions.filter(matchAnyTermFilter);
    result = startDateTime ? result.filter(filterByDateTime((a, b) => a >= b)(startDateTime)) : result;
    result = endDateTime ? result.filter(filterByDateTime((a, b) => a <= b)(endDateTime)) : result;

    return result;
});

const filterBySearch = (caseSensitive: boolean): Array<(searchTerm: string) => (transaction: Transaction) => boolean> => {
    return [
        (caseSensitive ? filterByDescriptionCaseSensitive : filterByDescriptionCaseInsensitive),
        filterByAmount,
        filterByDate,
    ]
}

const filterByDescriptionCaseSensitive = (searchTerm: string) => (transaction: Transaction): boolean => transaction.description.includes(searchTerm);
const filterByDescriptionCaseInsensitive = (searchTerm: string) => (transaction: Transaction): boolean => {
    const matches = transaction.description.match(new RegExp(searchTerm, "i"));
    
    return (matches && matches.length > 0);
};

const filterByAmount = (searchTerm: string) => (transaction: Transaction): boolean => transaction.amount.toString().includes(searchTerm);
const filterByDate = (searchTerm: string) => (transaction: Transaction): boolean => formatCreatedDate(transaction.created).includes(searchTerm);

const filterByDateTime = (comparator: <T>(t1: T, t2: T) => boolean) => (dateTime: Date) => (transaction: Transaction): boolean => comparator(transaction.created, dateTime);