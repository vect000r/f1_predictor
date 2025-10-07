import type { Driver, PodiumData, Standing, PredictionsResponse } from "./types"

const API_BASE_URL = "http://127.0.0.1:8000"

export async function getPodiumData(): Promise<PodiumData> {
    try {
        const response = await fetch(`${API_BASE_URL}/top3/latest/`, {
            cache: "no-store",
        })

        if (!response.ok) {
            throw new Error("Failed to fetch podium data")
        }

        return await response.json()
    } catch (error) {
        console.error("Error fetching podium data", error)
        return {
            results: []
        }
    }
}

export async function getDriverData(driverNumber: number): Promise<Driver | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/drivers/${driverNumber}/`, {
            cache: "no-store",
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch driver ${driverNumber}`)
        }
    
        return await response.json()
    } catch (error) {
        console.error(`Error fetching driver ${driverNumber}:`, error)
        return null
    }
}

export async function getAllDrivers(): Promise<Driver[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/drivers/`, {
      cache: "no-store",
    })
    
    if (!response.ok) {
      throw new Error("Failed to fetch drivers")
    }
    
    return await response.json()
  } catch (error) {
    console.error("Error fetching drivers:", error)
    return []
  }
}

export async function getDriverStanding(driverNumber: number, roundNumber: number): Promise<Standing | null> {
    try {
        const response = await fetch(
            `${API_BASE_URL}/driverstandings/round/${roundNumber}/driver/${driverNumber}`, 
            { cache: "no-store" }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch driver #${driverNumber}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching standings for driver #${driverNumber}`);
        return null;
    }
}

export async function getLatestDriverStanding(driverNumber: number): Promise<Standing | null> {
    try {
        const response = await fetch(
            `${API_BASE_URL}/driverstandings/round/latest/driver/${driverNumber}`, 
            { cache: "no-store" }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch driver #${driverNumber}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching standings for driver #${driverNumber}`);
        return null;
    }
}

export async function getDriverPoints(): Promise<any[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/driverpoints/`, {
            cache: "no-store",
        })
    
        if (!response.ok) {
            throw new Error("Failed to fetch driver points")
        }
    
        return await response.json()
    } catch (error) {
        console.error("Error fetching driver points:", error)
        return []
    }
}

export async function getPredictions(): Promise<PredictionsResponse | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/predictions/`, {
            cache: "no-store",
        })

        if (!response.ok) {
            throw new Error("Failed to fetch predictions")
        }

        return await response.json()

    } catch (error) {
        console.error("Error fetching predictions:", error)
        return null
    }
}