<script lang="ts">
import { searchTerm, caseSensitiveSearch } from "../Store";
import { TextField, Switch } from "attractions";
import { SearchIcon } from "svelte-feather-icons";
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
</main>

<style>
    main {
        padding-top: 20px;
        max-width: 500px;
        margin: 0 auto;
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