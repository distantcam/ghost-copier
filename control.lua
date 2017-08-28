local recipe

script.on_event({defines.events.on_built_entity},
    function (e)
        local placed = e.created_entity

        if recipe then
            if placed.type == "assembling-machine" then
                placed.recipe = recipe
            end
            recipe = nil 
        end
    end
)

script.on_event({defines.events.on_put_item},
    function (e)
        local surface = game.players[e.player_index].surface
        local ghost = surface.find_entity("entity-ghost", e.position)

        if ghost and ghost.ghost_type == "assembling-machine" and ghost.recipe then
            recipe = ghost.recipe
        end
    end
)