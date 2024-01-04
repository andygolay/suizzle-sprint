// Copyright (c) Andy Golay
// SPDX-License-Identifier: Apache-2.0

module suizzle_sprint::sprint_game {
    use sui::object::{Self, UID, ID};
    use sui::transfer::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::clock::{Self, Clock};

    friend suizzle_sprint::leaderboard;   

    struct SprintGame has key, store {
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
            duration: 1000000
        };
        transfer(game, player);
    }

    public entry fun end_game(clock: &Clock, game: &mut SprintGame) {

        let end_time = clock::timestamp_ms(clock);
        game.end_time = end_time;
        game.duration = game.end_time - game.start_time;
    }

    public entry fun delete_game(game: SprintGame) {
        let SprintGame { id, player: _, start_time: _, end_time: _, duration: _ } = game;
        object::delete(id);
    }

// PUBLIC ACCESSOR FUNCTIONS

    public fun id(game: &SprintGame): ID {
        object::uid_to_inner(&game.id)
    }

    public fun player(game: &SprintGame): &address {
        &game.player
    }

    public fun start_time(game: &SprintGame): &u64 {
        &game.start_time
    }

    public fun end_time(game: &SprintGame): &u64 {
        &game.end_time
    }

    public fun duration(game: &SprintGame): &u64 {
        &game.duration
    }
}