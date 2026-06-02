"""Add missing columns to existing SQLite databases."""
import sqlite3
import os

COACH_COLUMNS = [
    ('banner_url', 'VARCHAR(500)'),
    ('academy_organization', 'VARCHAR(200)'),
    ('coaching_philosophy', 'TEXT'),
    ('training_approach', 'TEXT'),
    ('areas_of_expertise', 'TEXT'),
    ('specializations', 'VARCHAR(500) DEFAULT ""'),
    ('assessments_reviewed', 'INTEGER DEFAULT 0'),
    ('success_rate', 'REAL DEFAULT 85.0'),
    ('improvement_pct', 'REAL DEFAULT 18.0'),
    ('national_athletes_produced', 'INTEGER DEFAULT 0'),
    ('coach_ranking', 'INTEGER DEFAULT 100'),
    ('profile_completion', 'INTEGER DEFAULT 80'),
    ('badges', 'VARCHAR(500) DEFAULT ""'),
]

COMM_TABLE_DDL = [
    """
    CREATE TABLE IF NOT EXISTS notification (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipient_type VARCHAR(20) NOT NULL,
        recipient_id INTEGER NOT NULL,
        title VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) NOT NULL DEFAULT 'platform',
        category VARCHAR(50) NOT NULL DEFAULT 'platform',
        read_status BOOLEAN DEFAULT 0,
        read_at DATETIME,
        metadata_json TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS conversation (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        participantA_type VARCHAR(20) NOT NULL,
        participantA_id INTEGER NOT NULL,
        participantB_type VARCHAR(20) NOT NULL,
        participantB_id INTEGER NOT NULL,
        last_message VARCHAR(500),
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS message (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id INTEGER NOT NULL,
        sender_type VARCHAR(20) NOT NULL,
        sender_id INTEGER NOT NULL,
        receiver_type VARCHAR(20) NOT NULL,
        receiver_id INTEGER NOT NULL,
        content TEXT,
        attachment_path VARCHAR(500),
        read_status BOOLEAN DEFAULT 0,
        delivered_status BOOLEAN DEFAULT 0,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(conversation_id) REFERENCES conversation(id)
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS conversation_participant_state (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id INTEGER NOT NULL,
        participant_type VARCHAR(20) NOT NULL,
        participant_id INTEGER NOT NULL,
        last_read_message_id INTEGER,
        typing_status BOOLEAN DEFAULT 0,
        online_status BOOLEAN DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(conversation_id) REFERENCES conversation(id)
    )
    """,
]


def migrate_database(db_path):
    if not os.path.exists(db_path):
        return
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(user)")
    columns = {row[1] for row in cursor.fetchall()}
    if 'bio' not in columns:
        cursor.execute("ALTER TABLE user ADD COLUMN bio TEXT")
    if 'profile_photo' not in columns:
        cursor.execute("ALTER TABLE user ADD COLUMN profile_photo VARCHAR(255)")
    if 'username' not in columns:
        cursor.execute("ALTER TABLE user ADD COLUMN username VARCHAR(80)")
    if 'is_verified' not in columns:
        cursor.execute("ALTER TABLE user ADD COLUMN is_verified BOOLEAN DEFAULT 0")
    if 'is_featured' not in columns:
        cursor.execute("ALTER TABLE user ADD COLUMN is_featured BOOLEAN DEFAULT 0")
    if 'badges' not in columns:
        cursor.execute("ALTER TABLE user ADD COLUMN badges VARCHAR(500) DEFAULT ''")

    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='coach'")
    if cursor.fetchone():
        cursor.execute("PRAGMA table_info(coach)")
        coach_cols = {row[1] for row in cursor.fetchall()}
        for col, typedef in COACH_COLUMNS:
            if col not in coach_cols:
                cursor.execute(f"ALTER TABLE coach ADD COLUMN {col} {typedef}")

    for ddl in COMM_TABLE_DDL:
        cursor.execute(ddl)

    conn.commit()
    conn.close()
