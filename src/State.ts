import { writable } from "svelte/store";
import type { Transaction } from "./Models";

export const transactions = writable<Array<Transaction>>([]);

export type AppState = {
    clientId: string,
    clientSecret: string,
    accessToken?: string | null,
    transactions?: Array<Transaction> | null,
};

export const setState = (appState: AppState): void => {
    window.localStorage.setItem("appState", JSON.stringify(appState));
}

export const getState = (): AppState | null => {
    const appState = window.localStorage.getItem("appState");
    if (!appState)
        return null;

    return JSON.parse(appState, (key, val) => {
        if (key === "created")
            return new Date(val);
        
        return val;
    });
}