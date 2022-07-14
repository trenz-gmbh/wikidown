import {createStore} from 'vuex'
import {State} from "@/store/State";
import {IndexedFile} from "@/models/IndexedFile";
import {SearchResult} from "@/models/SearchResult";
import {NavTree} from "@/models/NavTree";
import * as api from "@/api";
import ApiClient, {ApiError} from "@/api/ApiClient";

export default createStore({
    state: {
        navTree: {},
        searchQuery: '',
        searchResults: [],
        searchResultMessage: null,
        documents: new Map(),
    } as State,
    getters: {},
    mutations: {
        setNavTree(state: State, navTree: NavTree) {
            state.navTree = navTree;
        },

        setSearchQuery(state: State, searchQuery: string) {
            state.searchQuery = searchQuery;
        },

        setSearchResults(state: State, {results, message}: { results: SearchResult[], message: string | null }) {
            state.searchResults = results;
            state.searchResultMessage = message;
        },

        putDocument(state: State, document: IndexedFile) {
            state.documents.set(document.location, document);
        }
    },
    actions: {
        async loadNavTree({commit}) {
            commit('setNavTree', await api.documents.navTree());
        },

        async search({commit}, query: string) {
            await commit('setSearchQuery', query);

            if (query.length === 0) {
                commit('setSearchResults', {
                    results: [],
                    message: "Search for something. Your results will be shown here."
                });

                return;
            }

            try {
                const results = await api.search(query);

                commit('setSearchResults', {
                    results: results,
                    message: results.length === 0 ? "No results found." : null
                });
            } catch (e: unknown) {
                let message = "An unknown error occurred.";
                if (e instanceof Error) {
                    message = "The following error occurred: " + e.message;
                    console.error(e);
                }

                commit('setSearchResults', {results: [], message});
            }
        },

        async findDocumentByLocation({state, commit}, location: string): Promise<string> {
            let doc: IndexedFile | null = null;
            if (state.documents.has(location)) {
                doc = state.documents.get(location) || null;
                if (doc) {
                    return doc.content;
                }
            }

            const notFoundText = "This page does not exist.";

            try {
                doc = await api.documents.byLocation(location);
            } catch (e) {
                console.error(e);

                if (e instanceof ApiError) {
                    switch (e.response.status) {
                        case 404:
                            throw notFoundText;
                        case 500:
                            throw "The server encountered an error. Please try again later.";
                        case 503:
                            throw "The server is currently unavailable. Please try again later.";
                        default:
                            break;
                    }
                } else if (e instanceof TypeError) {
                    if (e.message === "Failed to fetch") {
                        throw "The server is currently unavailable. Please try again later.";
                    }
                }

                throw "An unexpected error occurred while loading the document. Please try again later.";
            }

            if (doc === null) {
                return notFoundText;
            }

            doc.content = doc.content.replaceAll("%API_HOST%", ApiClient.getBaseUrl()?.slice(0, -1) ?? "/api");

            commit('putDocument', doc);

            return doc.content;
        }
    }
})
