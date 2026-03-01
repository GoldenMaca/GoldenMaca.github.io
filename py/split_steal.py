import random
import os
import math
import time
import builtins

while True:
    gamemode = input("Would you like to play with other players or bots? (p(player)/b(bot)) ").strip().lower()
    if gamemode in ['p', 'b']:
        break
    print("Invalid input. Please enter 'p' for player or 'b' for bot")
if gamemode == 'p':
    players = input("Enter player names separated by commas: ").strip().split(',')
    players = [p.strip() for p in players if p.strip()]
    if not players:
        print("No valid player names entered. Exiting.")
        exit()
else:
    num_bots = input("Enter number of bots to play against: ").strip()
    try:
        num_bots = int(num_bots)
        if num_bots < 1:
            raise ValueError
    except ValueError:
        print("Invalid number of bots. Exiting.")
        exit()
    players = [f"Bot{i+1}" for i in range(num_bots)]
print(f"Players: {', '.join(players)}")
# Game config
ROUNDS = 10
START_MONEY = 100
BASE_POT = 50
POT_INCREMENT = 25

# Shop costs
COSTS = {
    "mult_x2": 50,
    "mult_x3": 100,
    "instant": 75,
    "freeze": 60,
    "hack": 80,
}

# Intercept prints that announce the round header to also show the prize for that round.
_original_print = builtins.print

def _print_with_prize(*args, **kwargs):
    # Print as usual
    _original_print(*args, **kwargs)
    # If the first printed arg is the round header like "Round 1/10", print the prize line.
    try:
        if args and isinstance(args[0], str) and args[0].startswith("Round "):
            # Expect format "Round {cur}/{total}"
            header_parts = args[0].split()
            if len(header_parts) >= 2 and "/" in header_parts[1]:
                cur = int(header_parts[1].split("/")[0])
                pot = BASE_POT + (cur - 1) * POT_INCREMENT
                _original_print(f"Prize this round: ${pot:.2f}")
    except Exception:
        pass

builtins.print = _print_with_prize

# Wrap input to clear the console immediately after a player chooses split/steal,
# improving privacy and making the UI cleaner.
_original_input = builtins.input
_SPLIT_PROMPT_SNIPPET = "Choose (s)plit or (t)eal"

def _wrapped_input(prompt=""):
    resp = _original_input(prompt)
    try:
        if _SPLIT_PROMPT_SNIPPET in str(prompt) and resp.strip().lower() in ("s", "t"):
            # clear() is defined later in the file; it will exist by the time this runs.
            clear()
    except Exception:
        pass
    return resp

builtins.input = _wrapped_input

HACK_BOXES = [0, 5, 10, 20]  # percents

# Initialize player structures
player_data = {}
for name in players:
    player_data[name] = {
        "money": float(START_MONEY),
        "pending": {  # effects purchased for next round
            "mult": 1,
            "instant": 0,
            "freeze_target": None,
            "hack": 0,
        },
        "owned": {  # inventory counts (bots may buy multiple)
            # multipliers stored as list of factors to apply sequentially on wins
            "mults": [],  # values like 2 or 3
            "instants": 0,
            "freezes": 0,
            "hacks": 0,
        },
    }

def clear():
    os.system('cls' if os.name == 'nt' else 'clear')

def pause():
    input("Press Enter to continue...")

def print_leaderboard():
    sorted_players = sorted(player_data.items(), key=lambda kv: kv[1]["money"], reverse=True)
    print("Leaderboard:")
    for i, (name, pdata) in enumerate(sorted_players, 1):
        print(f"{i}. {name}: ${pdata['money']:.2f}")

def bot_shop_behavior(name):
    pdata = player_data[name]
    money = pdata["money"]

    # Simple probabilistic purchases
    # Try to buy a multiplier if affordable and under a cap
    if money >= COSTS["mult_x2"] and random.random() < 0.4:
        pdata["owned"]["mults"].append(2)
        pdata["money"] -= COSTS["mult_x2"]
        money -= COSTS["mult_x2"]
    if money >= COSTS["mult_x3"] and random.random() < 0.2:
        pdata["owned"]["mults"].append(3)
        pdata["money"] -= COSTS["mult_x3"]
        money -= COSTS["mult_x3"]
    if money >= COSTS["instant"] and random.random() < 0.3:
        pdata["owned"]["instants"] += 1
        pdata["money"] -= COSTS["instant"]
        money -= COSTS["instant"]
    if money >= COSTS["freeze"] and random.random() < 0.25:
        pdata["owned"]["freezes"] += 1
        pdata["money"] -= COSTS["freeze"]
        money -= COSTS["freeze"]
    if money >= COSTS["hack"] and xxz13random.random() < 0.25:
        pdata["owned"]["hacks"] += 1
        pdata["money"] -= COSTS["hack"]

def human_shop(name):
    pdata = player_data[name]
    while True:
        clear()
        print(f"{name} shop — Money: ${pdata['money']:.2f}")
        # ensure console is cleared after any user input from now on
        def _shop_input(prompt=""):
            resp = _original_input(prompt)
            try:
                clear()
            except Exception:
                pass
            return resp
        builtins.input = _shop_input
        print("Available purchases:")
        print(f"1) Multiplier x2 (${COSTS['mult_x2']})")
        print(f"2) Multiplier x3 (${COSTS['mult_x3']})")
        print(f"3) Instant Steal (${COSTS['instant']})")
        print(f"4) Freeze (${COSTS['freeze']})")
        print(f"5) Hack (${COSTS['hack']})")
        print("6) Done")
        choice = input("Choose an option (enter number): ").strip()
        if choice == "1":
            if pdata["money"] >= COSTS["mult_x2"]:
                pdata["owned"]["mults"].append(2)
                pdata["money"] -= COSTS["mult_x2"]
            else:
                input("Not enough money. Press Enter.")
        elif choice == "2":
            if pdata["money"] >= COSTS["mult_x3"]:
                pdata["owned"]["mults"].append(3)
                pdata["money"] -= COSTS["mult_x3"]
            else:
                input("Not enough money. Press Enter.")
        elif choice == "3":
            if pdata["money"] >= COSTS["instant"]:
                pdata["owned"]["instants"] += 1
                pdata["money"] -= COSTS["instant"]
            else:
                input("Not enough money. Press Enter.")
        elif choice == "4":
            if pdata["money"] >= COSTS["freeze"]:
                # choose target
                targets = [p for p in player_data.keys() if p != name]
                if not targets:
                    input("No valid targets. Press Enter.")
                else:
                    print("Targets:", ", ".join(targets))
                    tgt = input("Enter target name to freeze next round: ").strip()
                    if tgt in targets:
                        pdata["owned"]["freezes"] += 1
                        pdata["money"] -= COSTS["freeze"]
                    else:
                        input("Invalid target. Press Enter.")
        elif choice == "5":
            if pdata["money"] >= COSTS["hack"]:
                pdata["owned"]["hacks"] += 1
                pdata["money"] -= COSTS["hack"]
            else:
                input("Not enough money. Press Enter.")
        elif choice == "6":
            break
        else:
            input("Invalid choice. Press Enter.")

def setup_shop_for_round():
    # Let players buy between rounds
    for name in list(player_data.keys()):
        if name.lower().startswith("bot"):
            bot_shop_behavior(name)
        else:
            human_shop(name)

    # After purchases, allow players to assign instant/freeze/hack to be used next round optionally
    # For simplicity we auto-activate one instant/mult if owned, and let humans choose freeze targets next.
    for name, pdata in player_data.items():
        # Activate one available instant automatically for next round if owned
        if pdata["owned"]["instants"] > 0:
            pdata["pending"]["instant"] = pdata["owned"]["instants"]
            pdata["owned"]["instants"] = 0

        # Move one multiplier into pending multiplier (multiply factor)
        if pdata["owned"]["mults"]:
            # choose the highest multiplier to pending (use pop)
            mult = pdata["owned"]["mults"].pop(0)
            pdata["pending"]["mult"] = mult

        # Freezes: if human with freezes allow selecting targets; bots choose random
        if pdata["owned"]["freezes"] > 0:
            if not name.lower().startswith("bot"):
                clear()
                print(f"{name}, you have {pdata['owned']['freezes']} freeze(s).")
                print("Players:", ", ".join([p for p in player_data.keys() if p != name]))
                tgt = input("Enter a target to freeze next round (or blank to skip): ").strip()
                if tgt in player_data and tgt != name:
                    pdata["pending"]["freeze_target"] = tgt
                    pdata["owned"]["freezes"] -= 1
            else:
                targets = [p for p in player_data.keys() if p != name]
                if targets:
                    tgt = random.choice(targets)
                    pdata["pending"]["freeze_target"] = tgt
                    pdata["owned"]["freezes"] -= 1

        # Hacks: activate count
        if pdata["owned"]["hacks"] > 0:
            pdata["pending"]["hack"] = pdata["owned"]["hacks"]
            pdata["owned"]["hacks"] = 0

def apply_hacks():
    # For each player with a pending hack, perform hack immediately stealing percent of a random target's money
    for name, pdata in player_data.items():
        hacks = pdata["pending"].get("hack", 0)
        for i in range(hacks):
            targets = [p for p in player_data.keys() if p != name and player_data[p]["money"] > 0]
            if not targets:
                continue
            victim = random.choice(targets)
            box = random.choice(HACK_BOXES)
            stolen = math.floor(player_data[victim]["money"] * (box / 100.0) * 100) / 100.0
            if stolen > 0:
                player_data[victim]["money"] -= stolen
                pdata["money"] += stolen
            # show brief message only to console then clear
            clear()
            print(f"Hack: {name} hacked {victim} and got {box}% = ${stolen:.2f}")
            time.sleep(1)

def prompt_choice_private(name):
    clear()
    pdata = player_data[name]
    print(f"{name}'s turn — Money: ${pdata['money']:.2f}")
    if pdata["pending"]["instant"]:
        print("You have an Instant Steal active for this round.")
    if pdata["pending"]["mult"] and pdata["pending"]["mult"] > 1:
        print(f"Multiplier x{pdata['pending']['mult']} will apply to your next win this round.")
    while True:
        choice = input("Choose (s)plit or (t)eal: ").strip().lower()
        if choice in ("s", "t"):
            return "split" if choice == "s" else "steal"
        print("Invalid. Enter 's' or 't'.")

def bot_choice(name):
    pdata = player_data[name]
    # Basic heuristic: if low money and opponent likely to split, steal; with instant more likely to steal
    if pdata["pending"]["instant"]:
        return "steal"
    return "steal" if random.random() < 0.5 else "split"

def resolve_pair(a, b, pot):
    pa = player_data[a]
    pb = player_data[b]
    # actions assumed recorded in pa['action'], pb['action']
    act_a = pa.get("action", "split")
    act_b = pb.get("action", "split")

    # instant flags
    inst_a = pa["pending"].get("instant", 0) > 0
    inst_b = pb["pending"].get("instant", 0) > 0

    # Determine result following rules:
    # - If both instants: instants cancel -> treat as both steal (both get nothing)
    # - If one instant: that player steals entire pot regardless of other's action (except cancelled by opponent instant)
    # - Else follow classic rules: both split -> split pot equally; one steal other split -> stealer gets pot; both steal -> nobody gets pot
    winner = None
    payout_a = payout_b = 0.0

    if inst_a and inst_b:
        # consumed both instants
        pa["pending"]["instant"] = max(0, pa["pending"]["instant"] - 1)
        pb["pending"]["instant"] = max(0, pb["pending"]["instant"] - 1)
        # both get nothing
    elif inst_a:
        pa["pending"]["instant"] = max(0, pa["pending"]["instant"] - 1)
        # a wins pot
        payout_a = pot
    elif inst_b:
        pb["pending"]["instant"] = max(0, pb["pending"]["instant"] - 1)
        payout_b = pot
    else:
        # No instants
        if act_a == "split" and act_b == "split":
            payout_a = payout_b = pot / 2.0
        elif act_a == "steal" and act_b == "split":
            payout_a = pot
        elif act_b == "steal" and act_a == "split":
            payout_b = pot
        elif act_a == "steal" and act_b == "steal":
            # both get nothing
            pass

    # Apply multipliers to payouts (player's pending mult applies and then resets)
    if payout_a > 0 and pa["pending"].get("mult", 1) > 1:
        payout_a *= pa["pending"]["mult"]
        pa["pending"]["mult"] = 1
    if payout_b > 0 and pb["pending"].get("mult", 1) > 1:
        payout_b *= pb["pending"]["mult"]
        pb["pending"]["mult"] = 1

    # Round payouts: add to money
    pa["money"] += payout_a
    pb["money"] += payout_b

    return {
        "a": {"name": a, "action": act_a, "payout": payout_a},
        "b": {"name": b, "action": act_b, "payout": payout_b},
    }

# Main rounds
for rnd in range(1, ROUNDS + 1):
    clear()
    print(f"Round {rnd}/{ROUNDS}")
    print_leaderboard()
    print()
    # Setup shop
    setup_shop_for_round()
    # Apply hacks immediately before matches
    apply_hacks()

    # Determine frozen players for this round
    frozen = set()
    for name, pdata in player_data.items():
        tgt = pdata["pending"].get("freeze_target")
        if tgt:
            frozen.add(tgt)
            # freeze consumes the pending freeze_target (we assume freeze was paid at purchase)
            pdata["pending"]["freeze_target"] = None

    # Announce frozen players briefly
    if frozen:
        print("Frozen this round:", ", ".join(frozen))
        time.sleep(1)

    # Build active participants (not frozen)
    participants = [p for p in player_data.keys() if p not in frozen]
    random.shuffle(participants)

    # Pair players
    pairs = []
    i = 0
    while i < len(participants) - 1:
        pairs.append((participants[i], participants[i + 1]))
        i += 2
    odd_player = None
    if i == len(participants) - 1:
        odd_player = participants[i]

    round_results = []

    # For each pair, prompt choices privately
    for a, b in pairs:
        # Decide actions
        # Ensure console is cleared after any user input during these prompts
        _saved_input = builtins.input
        def _always_clear_input(prompt=""):
            resp = _original_input(prompt)
            try:
                clear()
            except Exception:
                pass
            return resp

        if not a.lower().startswith("bot"):
            builtins.input = _always_clear_input
            try:
                act_a = prompt_choice_private(a)
            finally:
                builtins.input = _saved_input
        else:
            act_a = bot_choice(a)

        if not b.lower().startswith("bot"):
            builtins.input = _always_clear_input
            try:
                act_b = prompt_choice_private(b)
            finally:
                builtins.input = _saved_input
        else:
            act_b = bot_choice(b)

        pot = BASE_POT + (rnd - 1) * POT_INCREMENT
        result = resolve_pair(a, b, pot)
        round_results.append(result)
        clear()
        print(f"Match: {a} ({act_a}) vs {b} ({act_b})")
        print(f"{a} earned ${result['a']['payout']:.2f}, {b} earned ${result['b']['payout']:.2f}")
        time.sleep(1)

    # Handle odd player (if any) — they automatically get half pot (treated as split alone)
    if odd_player:
        pot = BASE_POT + (rnd - 1) * POT_INCREMENT
        payout = pot / 2.0
        # apply multiplier if pending
        mult = player_data[odd_player]["pending"].get("mult", 1)
        if mult > 1:
            payout *= mult
            player_data[odd_player]["pending"]["mult"] = 1
        player_data[odd_player]["money"] += payout
        clear()
        print(f"{odd_player} had no opponent and received ${payout:.2f}")
        time.sleep(1)

    # Players who were frozen gain nothing and their pending instant/mult remain (or optionally reset?). We'll keep pending intact except freeze target processed.
    # Clear actions
    for pdata in player_data.values():
        pdata.pop("action", None)

    # Show round summary
    clear()
    print(f"End of round {rnd} summary:")
    print_leaderboard()
    print()
    pause()

# Final leaderboard
clear()
print("Game over — Final leaderboard:")
print_leaderboard()