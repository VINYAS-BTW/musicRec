import numpy as np
import pandas as pd
import tensorflow as tf
import tensorflow_recommenders as tfrs
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity


class HybridRecommender:
    def __init__(self, dataset_path="top_10000_1950-now.csv"):
        spotify = pd.read_csv(dataset_path)
        spotify = spotify.rename(columns={c: c.lower() for c in spotify.columns})
        spotify["song"] = spotify.get("track name", spotify.get("song", "Unknown"))
        spotify["song_id"] = spotify.index.astype(str)
        spotify["artist"] = spotify.get("album artist name(s)", "Unknown")
        spotify["genre"] = spotify.get("artist genres", "Unknown")

        self.spotify = spotify
        self.audio_cols = [c for c in spotify.columns if c in [
            "danceability", "energy", "valence", "tempo", "acousticness",
            "instrumentalness", "liveness", "speechiness", "loudness"
        ]]

        # --- Generate synthetic ratings ---
        users = [f"u{i}" for i in range(50)]
        ratings = pd.DataFrame({
            "user_id": np.random.choice(users, 500),
            "song_id": np.random.choice(spotify["song_id"], 500),
        })

        self.user_ids = ratings["user_id"].unique().tolist()
        self.song_ids = spotify["song_id"].unique().tolist()

        # --- Collaborative model ---
        class CFModel(tfrs.models.Model):
            def __init__(self, user_ids, song_ids):
                super().__init__()
                dim = 32
                self.user_model = tf.keras.Sequential([
                    tf.keras.layers.StringLookup(vocabulary=user_ids, mask_token=None),
                    tf.keras.layers.Embedding(len(user_ids) + 1, dim)
                ])
                self.song_model = tf.keras.Sequential([
                    tf.keras.layers.StringLookup(vocabulary=song_ids, mask_token=None),
                    tf.keras.layers.Embedding(len(song_ids) + 1, dim)
                ])
                self.task = tfrs.tasks.Retrieval()

            def compute_loss(self, features, training=False):
                user_emb = self.user_model(features["user_id"])
                song_emb = self.song_model(features["song_id"])
                return self.task(user_emb, song_emb)

        model = CFModel(self.user_ids, self.song_ids)
        model.compile(optimizer=tf.keras.optimizers.Adagrad(0.5))
        ratings_tf = tf.data.Dataset.from_tensor_slices(dict(ratings)).batch(256)
        model.fit(ratings_tf, epochs=1, verbose=0)

        self.model = model
        self.index = tfrs.layers.factorized_top_k.BruteForce(model.user_model)
        self.index.index_from_dataset(
            tf.data.Dataset.from_tensor_slices(self.song_ids).batch(128).map(model.song_model)
        )

        # --- Content similarity ---
        X = spotify[self.audio_cols].fillna(0.0).values
        scaler = StandardScaler()
        self.item_sim = cosine_similarity(scaler.fit_transform(X))

    # ---- Hybrid Recommendation ----
    def recommend(self, user_id, user_genres, N=35, alpha=0.6, beta=0.2):
        scores, song_ids_tf = self.index(tf.constant([user_id]))
        cf_scores = tf.squeeze(scores).numpy()
        cf_song_ids = [str(sid) for sid in tf.squeeze(song_ids_tf).numpy()]

        cf_full = np.zeros(len(self.spotify))
        id_to_idx = {sid: i for i, sid in enumerate(self.spotify["song_id"])}
        for sid, sc in zip(cf_song_ids, cf_scores):
            if sid in id_to_idx:
                cf_full[id_to_idx[sid]] = sc

        cb_scores = self.item_sim.mean(axis=0)
        gp_scores = np.zeros(len(self.spotify))
        for g in user_genres:
            gp_scores += self.spotify["genre"].str.contains(g, case=False, na=False).astype(int).values

        def norm(x): return (x - np.min(x)) / (np.max(x) - np.min(x) + 1e-9)
        hybrid = alpha * norm(cf_full) + (1 - alpha - beta) * norm(cb_scores) + beta * norm(gp_scores)

        top = np.argsort(-hybrid)[:N]
        results = []
        for i in top:
            results.append({
                "songName": self.spotify.iloc[i]["song"],
                "artist": self.spotify.iloc[i]["artist"],
                "genre": self.spotify.iloc[i]["genre"],
                "imagelinks": f"https://source.unsplash.com/400x400/?music,{self.spotify.iloc[i]['song']}"
            })
        return results
