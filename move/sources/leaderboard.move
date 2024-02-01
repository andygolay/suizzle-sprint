module suizzle_sprint::leaderboard {
    use std::vector;

    use sui::object::{Self, ID, UID};
    use sui::tx_context::{TxContext};
    use sui::transfer;

    use suizzle_sprint::sprint_game::{Self, SprintGame};

    const ENotALeader: u64 = 0;
    const EOffTheCharts: u64 = 1;

    struct SprintLeaderboard has key, store {
        id: UID,
        max_leaderboard_game_count: u64,
        top_games: vector<TopSprintGame>,
        max_duration: u64,
    }

    struct TopSprintGame has store, copy, drop {
        game_id: ID,
        leader_address: address,
        start_time: u64,
        duration: u64
    }

    fun init(ctx: &mut TxContext) {
        create(ctx);
    }

    // ENTRY FUNCTIONS //

    public entry fun create(ctx: &mut TxContext) {
        let leaderboard = SprintLeaderboard {
            id: object::new(ctx),
            max_leaderboard_game_count: 50,
            top_games: vector<TopSprintGame>[],
            max_duration: 1000000,
        };

        transfer::share_object(leaderboard);
    }

    public entry fun submit_game(game: &mut SprintGame, leaderboard: &mut SprintLeaderboard) {

        let duration = *sprint_game::duration(game);

        assert!(duration <= leaderboard.max_duration, EOffTheCharts);

        let leader_address = *sprint_game::player(game);
        let game_id = sprint_game::id(game);

        let top_game = TopSprintGame {
            game_id,
            leader_address,
            start_time: *sprint_game::start_time(game),
            duration: *sprint_game::duration(game),

        };

        add_top_game_sorted(leaderboard, top_game);
    }

    // PUBLIC ACCESSOR FUNCTIONS //

    public fun game_count(leaderboard: &SprintLeaderboard): u64 {
        vector::length(&leaderboard.top_games)
    }

    public fun top_games(leaderboard: &SprintLeaderboard): &vector<TopSprintGame> {
        &leaderboard.top_games
    }

    public fun top_game_at(leaderboard: &SprintLeaderboard, index: u64): &TopSprintGame {
        vector::borrow(&leaderboard.top_games, index)
    }

    public fun top_game_at_has_id(leaderboard: &SprintLeaderboard, index: u64, game_id: ID): bool {
        let top_game = top_game_at(leaderboard, index);
        top_game.game_id == game_id
    }

    public fun top_game_game_id(top_game: &TopSprintGame): ID {
        top_game.game_id
    }

    public fun top_game_duration(top_game: &TopSprintGame): &u64 {
        &top_game.duration
    }
    public fun max_duration(leaderboard: &SprintLeaderboard): &u64 {
        &leaderboard.max_duration
    }

    fun add_top_game_sorted(leaderboard: &mut SprintLeaderboard, top_game: TopSprintGame) {
        let top_games = leaderboard.top_games;
        let top_games_length = vector::length(&top_games);

        let index = 0;
        while (index < top_games_length) {
            let current_top_game = vector::borrow(&top_games, index);
            if (top_game.game_id == current_top_game.game_id) {
                vector::swap_remove(&mut top_games, index);
                break
            };
            index = index + 1;
        };

        vector::push_back(&mut top_games, top_game);

        top_games = merge_sort_top_games(top_games); 
        top_games_length = vector::length(&top_games);

        if (top_games_length > leaderboard.max_leaderboard_game_count) {
            vector::pop_back(&mut top_games);
            top_games_length  = top_games_length - 1;
        };

        if (top_games_length >= leaderboard.max_leaderboard_game_count) {
            let slowest_game = vector::borrow(&top_games, top_games_length - 1);
            leaderboard.max_duration = slowest_game.duration;
        };

        leaderboard.top_games = top_games;
    }

    public(friend) fun merge_sort_top_games(top_games: vector<TopSprintGame>): vector<TopSprintGame> {
        let top_games_length = vector::length(&top_games);
        if (top_games_length == 1) {
            return top_games
        };

        let mid = top_games_length / 2;

        let right = vector<TopSprintGame>[];
        let index = 0;
        while (index < mid) {
            vector::push_back(&mut right, vector::pop_back(&mut top_games));
            index = index + 1;
        };

        let sorted_left = merge_sort_top_games(top_games);
        let sorted_right = merge_sort_top_games(right);
        merge(sorted_left, sorted_right)
    }

    public(friend) fun merge(left: vector<TopSprintGame>, right: vector<TopSprintGame>): vector<TopSprintGame> {
        vector::reverse(&mut left);
        vector::reverse(&mut right);

        let result = vector<TopSprintGame>[];
        while (!vector::is_empty(&left) && !vector::is_empty(&right)) {
            let left_item = vector::borrow(&left, vector::length(&left) - 1);
            let right_item = vector::borrow(&right, vector::length(&right) - 1);

            if (left_item.duration < right_item.duration) {
                vector::push_back(&mut result, vector::pop_back(&mut left));
            } else if (left_item.duration > right_item.duration) {
                vector::push_back(&mut result, vector::pop_back(&mut right));
            } else {
                if (left_item.duration < right_item.duration) {
                    vector::push_back(&mut result, vector::pop_back(&mut left));
                } else {
                    vector::push_back(&mut result, vector::pop_back(&mut right));
                }
            };
        };

        vector::reverse(&mut left);
        vector::reverse(&mut right);
        
        vector::append(&mut result, left);
        vector::append(&mut result, right);
        result
    }
}
  
