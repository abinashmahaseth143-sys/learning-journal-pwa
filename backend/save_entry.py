import json
import os
from datetime import datetime

def save_reflection():
    # File path
    json_file = "reflections.json"
    
    # Load existing entries or create empty list
    if os.path.exists(json_file):
        with open(json_file, 'r', encoding='utf-8') as f:
            try:
                entries = json.load(f)
            except json.JSONDecodeError:
                entries = []
    else:
        entries = []
    
    # Get user input
    print("=== Learning Journal Reflection ===")
    print("Created by: Abhinas Mahaseth")
    print("Enter your reflection (type 'quit' to exit):")
    reflection_text = input("> ")
    
    if reflection_text.lower() == 'quit':
        return
    
    # Count words
    word_count = len(reflection_text.split())
    
    # Create entry
    new_entry = {
        "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "text": reflection_text,
        "words": word_count,
        "author": "Abhinas Mahaseth"
    }
    
    # Add to entries
    entries.append(new_entry)
    
    # Save back to file
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(entries, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Reflection saved by Abhinas Mahaseth! ({word_count} words)")
    print(f"Total entries: {len(entries)}")

if __name__ == "__main__":
    save_reflection()