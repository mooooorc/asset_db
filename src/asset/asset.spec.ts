import { describe, it, expect } from "vitest";
import { map_asset } from "./operations/map.js";
import type { AssetId } from "./asset.domain.js";
import type { DefinitionId } from "../definition/definition.domain.js";
import { get_asset } from "./operations/get.js";

describe("map_asset", () => {
  it("should mark identifiable definitions as required", () => {
    const asset = {
      id: "asset-1" as AssetId,
      name: "Pipes",
      expose_as_package: false,
    };

    const definitions = [
      {
        definition_id: "definition-1" as DefinitionId,
        required: false,
        identifiable: true,
      },
    ];

    const result = map_asset(asset, definitions);

    expect(result.definitions).toEqual([
      {
        definition: "definition-1",
        required: true,
        identifiable: true,
      },
    ]);
  });

  it("should omit exposeAsPackage when expose_as_package is false", () => {
    const asset = {
      id: "asset-2" as AssetId,
      name: "Pipes",
      expose_as_package: false,
    };

    const definitions = [
      {
        definition_id: "definition-1" as DefinitionId,
        required: false,
        identifiable: true,
      },
    ]

    expect(map_asset(asset, definitions)).toEqual({
      definitions: [
        {
          definition: "definition-1",
          required: true,
          identifiable: true
        }
      ],
      id: "asset-2",
      name: "Pipes",
      
    })
  });

  
});
