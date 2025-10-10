from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
from model.hybrid_recommender import HybridRecommender
import config

app = Flask(__name__)
CORS(app)
CORS(app,origins=["http://localhost:5173"], supports_credentials=True)
# MongoDB Connection
#client = MongoClient(config.MONGO_URI)
#db = client[config.DB_NAME]
#users_col = db[config.COLLECTION_USERS]
#recs_col = db[config.COLLECTION_RECOMMENDATIONS]

# Load recommender
recommender = HybridRecommender()

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.json
    print("Received data:", data) 
    user_id = data.get("user_id")
    user_prefs = data.get("preferences", [])

    if not user_id or not user_prefs:
        return jsonify({"error": "Missing user_id or preferences"}), 400

    # Store user prefs
    #users_col.update_one({"user_id": user_id}, {"$set": {"preferences": user_prefs}}, upsert=True)

    recs = recommender.recommend(user_id, user_prefs)
    '''rec_doc = {
        "user_id": user_id,
        "recommendations": recs,
        "timestamp": datetime.utcnow()
    }'''
    #recs_col.insert_one(rec_doc)

    return jsonify({"recommendations": recs})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
