import type { AxiosInstance, Method } from "axios";
import type { Account, Transaction } from "./Models";
import axios from "axios";
import { randomUUID } from "crypto";

const MONZO_AUTH_REDIRECT_URI = "http://localhost:5000";

export interface Client {
    login: (clientId: string) => Promise<void>,
    getAccessToken: (clientId: string, clientSecret: string, authorizationCode: string) => Promise<any>,
    accounts: () => Promise<Array<Account>>,
    transactions: (accountId: string) => Promise<Array<Transaction>>,
}

class RestClient implements Client {
    private httpClient: AxiosInstance;

    constructor(accessToken?: string) {
        this.httpClient = axios.create({
            baseURL: "https://api.monzo.com/"
        });

        if (accessToken !== null) {
            this.httpClient.interceptors.request.use(config => {
                console.log(`setting header: ${accessToken}`);
                config.headers = {
                    "Authorization": `Bearer ${accessToken}`,
                };
                return config;
            }, error => Promise.reject(error));
        }
    }

    private async makeRequest(method: Method, url: string, data?: any): Promise<JSON> {
        return this.httpClient({
            method: method,
            url: url,
            data: data,
        }).then(res => {
            return res.data;
        });
    }

    private async get(url: string, queryParams?: Record<string, string>) {
        let finalUrl = url;
        if (queryParams) {
            finalUrl += `?${new URLSearchParams(queryParams).toString()}`
        }
        return this.makeRequest("get", finalUrl);
    }

    private generateStateToken(): string {
        return randomUUID();
    }

    async login(clientId: string) {
        const queryParams = new URLSearchParams({
            client_id: clientId,
            redirect_uri: MONZO_AUTH_REDIRECT_URI,
            response_type: "code",
        });

        window.open(`https://auth.monzo.com/?${queryParams.toString()}`);
    }

    async getAccessToken(clientId: string, clientSecret: string, authorizationCode: string): Promise<string | null> {
        let response = await axios.post("https://api.monzo.com/oauth2/token", new URLSearchParams({
            grant_type: "authorization_code",
            client_id: clientId,
            client_secret: clientSecret,
            code: authorizationCode,
            redirect_uri: MONZO_AUTH_REDIRECT_URI,
        }));

        if (!response.data.hasOwnProperty("access_token"))
            return null;

        return response.data.access_token;
    }

    async accounts(): Promise<Array<Account>> {
        return this.get("accounts").then(result => result["accounts"]);
    }

    async transactions(accountId: string): Promise<Array<Transaction>> {
        const since = new Date();
        since.setMonth(since.getMonth() - 2);

        const penceToPounds = (transaction: Transaction): Transaction => {
            return {
                ...transaction,
                ["amount"]: transaction.amount / 100.0,
                ["created"]: new Date(transaction.created),
            };
        };

        return this.get(
            "transactions",
            {
                "account_id": accountId,
            }
        ).then(result => result["transactions"].map(penceToPounds));
    }
}

export const makeClient = (accessToken?: string): Client => {
    return new RestClient(accessToken);
};