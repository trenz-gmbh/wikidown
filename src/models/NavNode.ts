import {IndexedFile} from "@/models/IndexedFile";
import {NavTree} from "@/models/NavTree";

export interface NavNode extends Omit<IndexedFile, 'content'> {
    children: NavTree | null;
}
