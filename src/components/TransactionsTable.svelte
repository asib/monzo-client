<script lang="ts">
    import { Transaction } from "../Models";

    export let transactions: Array<Transaction>;

    const formatCreatedDate = (date: Date): string => {
        return `${date.toLocaleDateString("en-GB")} ${date.toLocaleTimeString("en-GB")}`;
    }
</script>

<main>
    <table>
        <thead>
            <tr>
                <th>Amount</th>
                <th>Created</th>
                <th>Currency</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            {#each transactions as transaction }
                <tr>
                    <td>£{transaction.amount}</td>
                    <td>{formatCreatedDate(transaction.created)}</td>
                    <td>{transaction.currency}</td>
                    <td>{transaction.description}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</main>

<style>
    table {
        margin: 0 auto;
    }
</style>