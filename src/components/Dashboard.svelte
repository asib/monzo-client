<script lang="ts">
import * as Api from "../Api";
import * as State from "../State";
import { Transaction } from "../Models";
import TransactionsTable from "./TransactionsTable.svelte";
import TransactionFilters from "./TransactionFilters.svelte";
import { transactions, filteredTransactions } from "../Store";

function handleLogout(ev) {
    State.setState({
        ...State.getState(),
        accessToken: null,
    });
    window.location.reload();
}

const appState = State.getState();
const apiClient = Api.makeClient(appState.accessToken);

let transactionsPromise: Promise<void>;

if (!appState.transactions) {
    transactionsPromise = (async () => {
        const accounts = await apiClient.accounts();
        const _transactions = await apiClient.transactions(accounts[0].id);

        State.setState({
            ...State.getState(),
            transactions: _transactions,
        });

        $transactions = _transactions;
        return;
    })();
} else {
    $transactions = appState.transactions;
    transactionsPromise = Promise.resolve();
}

</script>

<main>
    <button on:click={handleLogout}>Logout</button>

    <TransactionFilters />

    {#await transactionsPromise }
        <p>Loading transactions...</p>
    {:then _complete }
        <TransactionsTable transactions={$filteredTransactions} />
    {:catch error }
        <p>{error.message}</p>
    {/await}
</main>

<style>
    main {
        text-align: center;
        margin: 0 auto;
    }
</style>