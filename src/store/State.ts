import {IndexedFile} from "@/models/IndexedFile";
import {NavTree} from "@/models/NavTree";
import {SearchResult} from "@/models/SearchResult";

export interface State {
    navTree: NavTree;
    searchQuery: string;
    searchResults: Array<SearchResult>;
    searchResultMessage: string | null;
    documents: Map<string, IndexedFile>;
}
