export interface Driver {
  id: number
  broadcast_name: string
  country_code: string
  driver_number: number
  first_name: string
  full_name: string
  headshot_url: string
  last_name: string
  meeting_key: number
  name_acronym: string
  session_key: number
  team_name: string
}

export interface PodiumResult {
  position: number
  driver_number: number
  number_of_laps: number
  points: number
  dnf: boolean
  duration: number
  gap_to_leader: number
  meeting_key: number
  session_key: number
}

export interface PodiumData {
  results: PodiumResult[]
}

export interface Standing {
  position: number
  points: number
  wins: number
  season: string
  round: number
  driver_number: number
}

export interface Prediction {
  driver_number: number
  predicted_position: number
  predicted_points_gain: number
  predicted_total_points: number
  current_position: number
  current_points: number
  confidence: number 
}

export interface PredictionsResponse {
  predictions: Record<string, Prediction>
  model_type: string
  generated_at: string
}