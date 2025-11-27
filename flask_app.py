# flask_app.py - Flask Backend for Learning Journal
from flask import Flask, request, jsonify, render_template, send_from_directory
import json
import os
from datetime import datetime
from flask_cors import CORS

# Creates the Flask application object
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Base directory and data file path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "reflections.json")

# Function to read reflections from JSON file
def load_reflections():
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, "r", encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, Exception) as e:
            print(f"Error loading reflections: {e}")
            return []
    return []

# Function to save reflections to JSON file
def save_reflections(reflections):
    try:
        with open(DATA_FILE, "w", encoding='utf-8') as f:
            json.dump(reflections, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Error saving reflections: {e}")
        return False

# Routes for serving HTML pages
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/journal")
def journal():
    return render_template("journal.html")

@app.route("/projects")
def projects():
    return render_template("projects.html")

@app.route("/about")
def about():
    return render_template("about.html")

# API Routes for reflections
@app.route("/api/reflections", methods=["GET"])
def get_reflections():
    """Get all reflections"""
    try:
        reflections = load_reflections()
        return jsonify({
            "success": True,
            "data": reflections,
            "count": len(reflections)
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route("/api/reflections", methods=["POST"])
def add_reflection():
    """Add a new reflection"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or 'text' not in data:
            return jsonify({
                "success": False,
                "error": "Reflection text is required"
            }), 400
        
        # Create new reflection
        new_reflection = {
            "id": datetime.now().strftime("%Y%m%d%H%M%S"),
            "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "text": data['text'],
            "title": data.get('title', 'New Reflection'),
            "words": len(data['text'].split()),
            "author": data.get('author', 'Abhinas Mahaseth'),
            "tags": data.get('tags', [])
        }
        
        # Load existing reflections and add new one
        reflections = load_reflections()
        reflections.append(new_reflection)
        
        # Save updated reflections
        if save_reflections(reflections):
            return jsonify({
                "success": True,
                "data": new_reflection,
                "message": "Reflection added successfully"
            }), 201
        else:
            return jsonify({
                "success": False,
                "error": "Failed to save reflection"
            }), 500
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route("/api/reflections/<reflection_id>", methods=["DELETE"])
def delete_reflection(reflection_id):
    """Delete a reflection by ID"""
    try:
        reflections = load_reflections()
        
        # Find and remove the reflection
        initial_count = len(reflections)
        reflections = [r for r in reflections if r.get('id') != reflection_id]
        
        if len(reflections) == initial_count:
            return jsonify({
                "success": False,
                "error": "Reflection not found"
            }), 404
        
        # Save updated reflections
        if save_reflections(reflections):
            return jsonify({
                "success": True,
                "message": "Reflection deleted successfully"
            })
        else:
            return jsonify({
                "success": False,
                "error": "Failed to save changes"
            }), 500
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route("/api/reflections/<reflection_id>", methods=["PUT"])
def update_reflection(reflection_id):
    """Update a reflection by ID"""
    try:
        data = request.get_json()
        reflections = load_reflections()
        
        # Find the reflection to update
        for reflection in reflections:
            if reflection.get('id') == reflection_id:
                # Update fields
                if 'text' in data:
                    reflection['text'] = data['text']
                    reflection['words'] = len(data['text'].split())
                if 'title' in data:
                    reflection['title'] = data['title']
                if 'tags' in data:
                    reflection['tags'] = data['tags']
                
                reflection['last_updated'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                
                # Save updated reflections
                if save_reflections(reflections):
                    return jsonify({
                        "success": True,
                        "data": reflection,
                        "message": "Reflection updated successfully"
                    })
                else:
                    return jsonify({
                        "success": False,
                        "error": "Failed to save changes"
                    }), 500
        
        return jsonify({
            "success": False,
            "error": "Reflection not found"
        }), 404
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route("/api/reflections/search", methods=["GET"])
def search_reflections():
    """Search reflections by keyword"""
    try:
        query = request.args.get('q', '').lower()
        if not query:
            return jsonify({
                "success": False,
                "error": "Search query is required"
            }), 400
        
        reflections = load_reflections()
        results = []
        
        for reflection in reflections:
            if (query in reflection.get('text', '').lower() or 
                query in reflection.get('title', '').lower() or
                any(query in tag.lower() for tag in reflection.get('tags', []))):
                results.append(reflection)
        
        return jsonify({
            "success": True,
            "data": results,
            "count": len(results),
            "query": query
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# Serve static files
@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

if __name__ == "__main__":
    app.run(debug=True)