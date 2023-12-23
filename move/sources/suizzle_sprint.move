// Copyright (c) Andy Golay
// SPDX-License-Identifier: Apache-2.0

module suizzle_sprint::suizzle_sprint {
    use sui::object::{Self, ID, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::clock::{Self, Clock};

    struct SprintGame has key {
        id: UID,
        player: address,
        start_time: u64,
        end_time: u64,
        duration: u64 
    }

    public entry fun create_game(clock: &Clock, ctx: &mut TxContext) {

        let id = object::new(ctx);
        let player = tx_context::sender(ctx);
        let start_time = clock::timestamp_ms(clock);

        let game = SprintGame {
            id,
            player,
            start_time,
            end_time: 0,
            duration: 0,
        };
        transfer::share_object(game);
    }

    public entry fun end_game(clock: &Clock, game: &mut SprintGame, ctx: &mut TxContext) {

        let end_time = clock::timestamp_ms(clock);
        game.end_time = end_time;
        game.duration = game.end_time - game.start_time;
    }

    public entry fun delete_game(game: SprintGame) {
        let SprintGame { id, player: _, start_time: _, end_time: _, duration: _ } = game;
        object::delete(id);
    }
}