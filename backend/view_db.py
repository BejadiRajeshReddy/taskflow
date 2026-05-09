import sqlite3

def view_database():
    print("--- CONNECTING TO DATABASE ---")
    conn = sqlite3.connect('taskapp.db')
    cursor = conn.cursor()

    print("\n=== USERS ===")
    cursor.execute("SELECT id, username, email FROM users")
    users = cursor.fetchall()
    for u in users:
        print(f"ID: {u[0]} | Username: {u[1]} | Email: {u[2]}")

    print("\n=== PROJECTS ===")
    cursor.execute("SELECT id, name, owner_id FROM projects")
    projects = cursor.fetchall()
    for p in projects:
        print(f"ID: {p[0]} | Name: {p[1]} | Owner ID: {p[2]}")

    print("\n=== TASKS ===")
    cursor.execute("SELECT id, title, status, project_id FROM tasks")
    tasks = cursor.fetchall()
    for t in tasks:
        print(f"ID: {t[0]} | Title: '{t[1]}' | Status: {t[2]} | Project ID: {t[3]}")

    conn.close()

if __name__ == '__main__':
    view_database()
