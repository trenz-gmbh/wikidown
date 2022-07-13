import {IndexedFile} from "@/models/IndexedFile";
import ApiClient from "@/api/ApiClient";
import {NavTree} from "@/models/NavTree";

export default {
    async navTree(): Promise<NavTree> {
        return ApiClient.getJson('Documents/NavTree');
    },

    async byLocation(location: string): Promise<IndexedFile | null> {
        return ApiClient.getJson(`Documents/ByLocation/${location}`);
    }
}
