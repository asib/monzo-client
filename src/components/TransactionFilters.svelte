<script lang="ts">
import type { Writable } from "svelte/store";
import { searchTerm, caseSensitiveSearch, startDate, startTime, endDate, endTime } from "../Store";
import { DatePicker, DateRange, Switch, TextField, TimePicker } from "attractions";
import { SearchIcon } from "svelte-feather-icons";
import { setState } from "../State";

const setDate = (stateVar: Writable<Date>) => (ev: CustomEvent<{ value: Date | DateRange }>) => {
    stateVar.set(ev.detail.value);
};
</script>

<main>
    <div class="line1">
        <TextField
            bind:value={$searchTerm}
            type="search"
            label="Search"
            outline
            withItem
        >
            <SearchIcon size="24" class="item" />
        </TextField>
        <Switch
            bind:value={$caseSensitiveSearch}
        >
            <span class="ml">Case sensitive</span>
        </Switch>
    </div>
    <div class="line2">
        <DatePicker on:change={setDate(startDate)} locale="en-GB" format="%d/%m/%Y" />
        <TimePicker on:change={setDate(startTime)} format="%H:%M:%S" />
        <span>to</span>
        <DatePicker on:change={setDate(endDate)} locale="en-GB" format="%d/%m/%Y" />
        <TimePicker on:change={setDate(endTime)} format="%H:%M:%S" />
    </div>
</main>

<style>
    main {
        padding-top: 20px;
        max-width: 500px;
        margin: 0 auto;
    }

    div:not(:first-child) {
        margin-top: 10px;
    }

    .line1 {
        display: grid;
        grid-template-columns: 65% auto;
        column-gap: 20px;
    }

    .ml {
        margin-left: 10px;
    }
</style>