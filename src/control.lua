local recipe
local inventoryBar

script.on_event({defines.events.on_built_entity},
    function (e)
        local placed = e.created_entity

        if recipe then
            if placed.type == "assembling-machine" then
                placed.set_recipe(recipe)
            end
            recipe = nil 
        end

        if inventoryBar then
            if placed.type == "container" then
                local placedInventory = placed.get_inventory(defines.inventory.chest)
                if placedInventory then
                    placedInventory.setbar(inventoryBar)
                end
            end
            inventoryBar = nil
        end
    end
)

script.on_event({defines.events.on_put_item},
    function (e)
        local surface = game.players[e.player_index].surface
        local ghost = surface.find_entity("entity-ghost", e.position)

        if ghost then
            if ghost.ghost_type == "assembling-machine" and ghost.get_recipe() then
                recipe = ghost.get_recipe()
            end

            if ghost.ghost_type == "container" then
                local nameToFind = ghost.ghost_name
                if ghost.revive() then
                    local entity = surface.find_entity(nameToFind, e.position)
                    if entity then
                        local inventory = entity.get_inventory(defines.inventory.chest)
                        if inventory.hasbar() then
                            inventoryBar = inventory.getbar()
                        end
                        entity.destroy()
                    end
                end
            end
        end
    end
)
