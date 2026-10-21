import { Injectable } from "@nestjs/common";
import type { ConditionedPackage, LinkedPackage } from "../package/package.domain.js";
import { persist_package } from "./operations/persist_package.js";

@Injectable()
export class PersistenceService {
    constructor(){}

    persist_linked_package(pack: LinkedPackage){
        return persist_package.linked(pack);
    }

    persist_conditioned_package(pack: ConditionedPackage){
        return persist_package.conditioned(pack);
    }
}
