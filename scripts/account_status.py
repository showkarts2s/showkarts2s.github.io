"""Report registered ShowKart accounts and active local login sessions."""

from __future__ import annotations

import argparse
import json
import sqlite3
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path

DEFAULT_DB = Path(__file__).resolve().parents[1] / "backend" / "showkart.sqlite3"
ROLE_LABELS = {
    "customer": "Customers",
    "admin": "Administrators",
    "card_manager": "Card Studio managers",
}


def active(expiry: str) -> bool:
    expires_at = datetime.fromisoformat(expiry)
    comparison_time = datetime.now(expires_at.tzinfo) if expires_at.tzinfo else datetime.now()
    return expires_at > comparison_time


def print_counts(title: str, counts: Counter[str]) -> None:
    print(f"\n{title}")
    for role in ("customer", "admin", "card_manager"):
        print(f"  {ROLE_LABELS[role]:22} {counts[role]}")
    print(f"  {'Total':22} {sum(counts.values())}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--db", type=Path, default=DEFAULT_DB, help="Path to showkart.sqlite3")
    args = parser.parse_args()

    if not args.db.exists():
        raise SystemExit(f"Database not found: {args.db}")

    with sqlite3.connect(args.db) as connection:
        row = connection.execute("SELECT data FROM demo_state WHERE id = 1").fetchone()
    if not row:
        raise SystemExit(
            "ShowKart state has not been created yet. Start the backend once and retry."
        )

    state = json.loads(row[0])
    users = state.get("users", {})
    sessions = [
        session for session in state.get("sessions", {}).values() if active(session["expires"])
    ]

    registered = Counter(user.get("role", "unknown") for user in users.values())
    session_counts: Counter[str] = Counter()
    logged_in_ids: dict[str, set[str]] = defaultdict(set)
    per_user_sessions: Counter[str] = Counter()
    for session in sessions:
        user = users.get(session.get("user_id"))
        if not user:
            continue
        role = user.get("role", "unknown")
        session_counts[role] += 1
        logged_in_ids[role].add(user["id"])
        per_user_sessions[user["id"]] += 1

    print(f"ShowKart account status ({args.db})")
    print_counts("Registered accounts", registered)
    print_counts("Active browser sessions", session_counts)
    print_counts(
        "Unique accounts currently logged in",
        Counter({role: len(ids) for role, ids in logged_in_ids.items()}),
    )

    if per_user_sessions:
        print("\nLogged-in accounts")
        for user_id, count in sorted(
            per_user_sessions.items(), key=lambda item: users[item[0]]["email"]
        ):
            user = users[user_id]
            print(f"  {user['email']:<32} {user['role']:<13} {count} session(s)")
    else:
        print("\nNo accounts are currently logged in.")


if __name__ == "__main__":
    main()
