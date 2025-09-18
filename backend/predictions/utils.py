import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error
import xgboost as xgb
import warnings
warnings.filterwarnings('ignore')

class Predictor:
    def __init__(self, model_type='random_forest'):
        self.model_type = model_type
        self.position_model = None
        self.points_model = None
        self.scaler = StandardScaler()
        self.feature_names = []

    def prepare_features(self, df):
        """
        Engineer features from standings data
        :param df:
        :return:
        """

        features_list = []

        df = df.sort_values(['driver_number', 'round'])

        for driver_num in df['driver_number'].unique():
            driver_data = df[df['driver_number'] == driver_num].copy()

            for i in range(len(driver_data)):
                if i == 0:
                    # first race, so no previous races to predict from
                    continue

                # what this model tries to predict
                current_race = driver_data.iloc[i]

                # data up to this point
                history = driver_data.iloc[:i]

                features = {
                    # Target variables
                    'target_position': current_race['position'],
                    'target_points_gained': current_race['points'] - history.iloc[-1]['points'] if i > 0 else 0,

                    # Driver identifier
                    'driver_number': driver_num,
                    'round': current_race['round'],

                    # Recent performance features (last 1-5 races)
                    'last_position': history.iloc[-1]['position'],
                    'last_2_avg_position': history.iloc[-2:]['position'].mean() if len(history) >= 2 else
                    history.iloc[-1]['position'],
                    'last_3_avg_position': history.iloc[-3:]['position'].mean() if len(history) >= 3 else history[
                        'position'].mean(),
                    'last_5_avg_position': history.iloc[-5:]['position'].mean() if len(history) >= 5 else history[
                        'position'].mean(),

                    # Momentum features
                    'position_trend_3_races': self._calculate_trend(history['position'].values, window=3),
                    'points_trend_3_races': self._calculate_trend(history['points'].values, window=3),

                    # Consistency features
                    'position_std_3_races': history.iloc[-3:]['position'].std() if len(history) >= 3 else 0,
                    'position_std_5_races': history.iloc[-5:]['position'].std() if len(history) >= 5 else 0,

                    # Championship standing features
                    'current_championship_position': history.iloc[-1]['position'],
                    'current_points': history.iloc[-1]['points'],
                    'current_wins': history.iloc[-1]['wins'],

                    # Season progress
                    'season_progress': current_race['round'] / 23,  # Assuming 23 races in season

                    # Win streak and performance streaks
                    'recent_wins': history.iloc[-3:]['wins'].max() - history.iloc[-3:]['wins'].min() if len(
                        history) >= 3 else 0,
                    'races_since_last_win': self._races_since_last_win(history),

                    # Points per race efficiency
                    'points_per_race_avg': history['points'].iloc[-1] / len(history),
                    'points_per_race_recent': (history.iloc[-3:]['points'].iloc[-1] - history.iloc[-3:]['points'].iloc[
                        0]) / 3 if len(history) >= 3 else 0,

                    # Position improvement/decline
                    'position_change_last_race': history.iloc[-1]['position'] - history.iloc[-2]['position'] if len(
                        history) >= 2 else 0,
                    'best_position_last_5': history.iloc[-5:]['position'].min() if len(history) >= 5 else history[
                        'position'].min(),
                    'worst_position_last_5': history.iloc[-5:]['position'].max() if len(history) >= 5 else history[
                        'position'].max(),
                }

                features_list.append(features)

        return pd.DataFrame(features_list)

    def _calculate_trend(self, values, window=3):
        """Calculate the trend of recent values"""

        if len(values) < 2:
            return 0
        recent_values = values[-window:] if len(values) >= window else values

        if len(recent_values) < 2:
            return 0

        x = np.arange(len(recent_values))

        return np.polyfit(x, recent_values, 1)[0]

    def _races_since_last_win(self, history):
        """Calculate races since last win"""

        wins = history['wins'].values

        if len(wins) < 2 or wins[-1] == wins[0]:
            # no wins
            return len(wins)

        # Look for where wins increased from round to round
        for i in range(len(wins) - 1, 0, -1):
            if wins[i] > wins[i - 1]:
                return len(wins) - i

        return len(wins)

    def train(self, standings):
        """
        Train models on standings data
        :param standings:
        :return:
        """

        print("Preparing features...")
        df = pd.DataFrame(standings)
        features_df = self.prepare_features(df)

        if len(features_df) == 0:
            raise ValueError("No training data available. Need at least 2 races per driver.")

        # separate features and targets
        target_cols = ['target_position', 'target_points_gained']
        feature_cols = [col for col in features_df.columns if col not in target_cols]

        X = features_df[feature_cols]
        y_position = features_df['target_position']
        y_points = features_df['target_points_gained']

        self.feature_names = feature_cols

        print(f"Training on {len(X)} race predictions with {len(feature_cols)} features")

        # train-test split
        X_train, X_test, y_pos_train, y_pos_test, y_pts_train, y_pts_test = train_test_split(
            X, y_position, y_points, test_size=0.2, random_state=42
        )

        # scaling features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)

        # 1. train position prediction model
        print("Training position prediction model...")
        if self.model_type == 'random_forest':
            self.position_model = RandomForestRegressor(
                n_estimators=100,
                max_depth=10,
                random_state=42,
                n_jobs=-1
            )
            self.position_model.fit(X_train, y_pos_train)
        elif self.model_type == 'xgboost':
            self.position_model = xgb.XGBRegressor(
                n_estimators=100,
                max_depth=6,
                learning_rate=0.1,
                random_state=42
            )
            self.position_model.fit(X_train, y_pos_train)

        # 2. train points prediction model
        print("Training points prediction model...")
        if self.model_type == 'random_forest':
            self.points_model = RandomForestRegressor(
                n_estimators=100,
                max_depth=10,
                random_state=42,
                n_jobs=-1
            )
            self.points_model.fit(X_train, y_pts_train)
        elif self.model_type == 'xgboost':
            self.points_model = xgb.XGBRegressor(
                n_estimators=100,
                max_depth=6,
                learning_rate=0.1,
                random_state=42
            )
            self.points_model.fit(X_train, y_pts_train)

        # evaluate models
        pos_pred = self.position_model.predict(X_test)
        pts_pred = self.points_model.predict(X_test)

        pos_mae = mean_absolute_error(y_pos_test, pos_pred)
        pts_mae = mean_absolute_error(y_pts_test, pts_pred)

        print(f"\nModel Performance:")
        print(f"Position Prediction MAE: {pos_mae:.2f} positions")
        print(f"Points Prediction MAE: {pts_mae:.2f} points")

        # decide feature importance
        if hasattr(self.position_model, 'feature_importances_'):
            importance_df = pd.DataFrame({
                'feature': feature_cols,
                'importance': self.position_model.feature_importances_
            }).sort_values('importance', ascending=False)

            print(f"\nTop 10 Most Important Features:")
            for i, row in importance_df.head(10).iterrows():
                print(f"  {row['feature']}: {row['importance']:.3f}")

        return {
            'position_mae': pos_mae,
            'points_mae': pts_mae,
            'training_samples': len(X_train),
            'test_samples': len(X_test)
        }

    def predict(self, standings, driver_number):
        """
        Predict next race performance for specific driver
        :param standings:
        :param driver_number:
        :return:
        """

        if self.position_model is None:
            raise ValueError("Model not trained yet. Call train_models() first.")

        df = pd.DataFrame(standings)
        driver_data = df[df['driver_number'] == driver_number].sort_values('round')

        if len(driver_data) == 0:
            return None

        # get latest data for this driver
        latest_race = driver_data.iloc[-1]
        history = driver_data

        # features for prediction (same as training but for current state)
        features = {
            'driver_number': driver_number,
            'round': latest_race['round'] + 1,  # next race
            'last_position': latest_race['position'],
            'last_2_avg_position': history.iloc[-2:]['position'].mean() if len(history) >= 2 else latest_race[
                'position'],
            'last_3_avg_position': history.iloc[-3:]['position'].mean() if len(history) >= 3 else history[
                'position'].mean(),
            'last_5_avg_position': history.iloc[-5:]['position'].mean() if len(history) >= 5 else history[
                'position'].mean(),
            'position_trend_3_races': self._calculate_trend(history['position'].values, window=3),
            'points_trend_3_races': self._calculate_trend(history['points'].values, window=3),
            'position_std_3_races': history.iloc[-3:]['position'].std() if len(history) >= 3 else 0,
            'position_std_5_races': history.iloc[-5:]['position'].std() if len(history) >= 5 else 0,
            'current_championship_position': latest_race['position'],
            'current_points': latest_race['points'],
            'current_wins': latest_race['wins'],
            'season_progress': (latest_race['round'] + 1) / 23,
            'recent_wins': history.iloc[-3:]['wins'].max() - history.iloc[-3:]['wins'].min() if len(
                history) >= 3 else 0,
            'races_since_last_win': self._races_since_last_win(history),
            'points_per_race_avg': latest_race['points'] / len(history),
            'points_per_race_recent': (history.iloc[-3:]['points'].iloc[-1] - history.iloc[-3:]['points'].iloc[
                0]) / 3 if len(history) >= 3 else 0,
            'position_change_last_race': latest_race['position'] - history.iloc[-2]['position'] if len(
                history) >= 2 else 0,
            'best_position_last_5': history.iloc[-5:]['position'].min() if len(history) >= 5 else history[
                'position'].min(),
            'worst_position_last_5': history.iloc[-5:]['position'].max() if len(history) >= 5 else history[
                'position'].max(),
        }

        # convert to pandas df with same column order as training
        feature_df = pd.DataFrame([features])
        feature_df = feature_df[self.feature_names]  # Ensure same order

        # make predictions (or predict whatever)
        predicted_position = self.position_model.predict(feature_df)[0]
        predicted_points_gain = self.points_model.predict(feature_df)[0]

        # ensure realistic bounds
        predicted_position = max(1, min(20, predicted_position))
        predicted_points_gain = max(0, predicted_points_gain)

        return {
            'driver_number': driver_number,
            'predicted_position': round(predicted_position, 1),
            'predicted_points_gain': round(predicted_points_gain, 1),
            'predicted_total_points': round(latest_race['points'] + predicted_points_gain, 1),
            'current_position': latest_race['position'],
            'current_points': latest_race['points'],
            'confidence': self._calculate_confidence(feature_df)
        }

    def _calculate_confidence(self, features):
        """
        Calculate prediction confidence
        :param features:
        :return:
        """

        if hasattr(self.position_model, 'predict_prob'):
            return 0.8
        else:
            return min(0.9, max(0.3, 0.8))
