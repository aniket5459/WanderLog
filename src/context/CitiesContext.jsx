/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { createContext, useState, useEffect, useContext, useReducer } from "react";

const CitiesContext = createContext();
const BASE_URL = "http://localhost:9000";

const initialState = {
    cities: [],
    isLoading: false,
    currentCity: {},
    error: ""
};

function reducer(state, action) {
    switch (action.type) {
        case "loading":
            return { ...state, isLoading: true }
        case 'cities/loaded':
            return {
                ...state,
                isLoading: false,
                cities: action.payload
            };

        case 'city/loaded':
            return {
                ...state,
                isLoading: false,
                currentCity: action.payload
            };

        case 'city/created':
            return {
                ...state,
                isLoading: false,
                cities: [...state.cities, action.payload],
                currentCity: action.payload,
            }

        case 'city/deleted':
            return {
                ...state,
                isLoading: false,
                cities: state.cities.filter((city) => city.id !== action.payload),
                currentCity: action.payload,
            };

        case 'rejected':
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        default:
            throw new Error("Unknown action type");
    }
}




function CitiesProvider({ children }) {
    const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(reducer, initialState)


    // const [cities, setCities] = useState([]);
    // const [isLoading, setIsLoading] = useState(false);
    // const [currentCity, setCurrentCity] = useState({})


    // useEffect(() => {
    //     async function fetchCities() {
    //         try {
    //             setIsLoading(true);
    //             const res = await fetch(`${BASE_URL}/cities`);
    //             const data = await res.json();
    //             setCities(data);
    //         } catch {
    //             alert("There was san error loading data....")
    //         } finally {
    //             setIsLoading(false);
    //         }

    //     }

    //     fetchCities();
    // }, [])



    useEffect(() => {
        async function fetchCities() {
            dispatch({ type: "loading" });
            try {

                const res = await fetch(`${BASE_URL}/cities`);
                const data = await res.json();
                dispatch({ type: "cities/loaded", payload: data });
            } catch {
                dispatch({
                    type: "rejected",
                    payload: "There was san error loading cities....",
                });

            }

        }

        fetchCities();
    }, [])

    // async function getCity(id) {

    //     try {
    //         setIsLoading(true);
    //         const res = await fetch(`${BASE_URL}/cities/${id}`);
    //         const data = await res.json();
    //         setCurrentCity(data);
    //     } catch {
    //         alert("There was san error loading data....")
    //     } finally {
    //         setIsLoading(false);
    //     }

    // }
    async function getCity(id) {
        if (Number(id) === currentCity.id) return;
        dispatch({ type: "loading" });
        try {

            const res = await fetch(`${BASE_URL}/cities/${id}`);
            const data = await res.json();
            dispatch({ type: 'city/loaded', payload: data })
        } catch {
            dispatch({
                type: "rejected",
                payload: "There was san error loading thr city....",
            });
        }

    }


    async function createCity(newCity) {
        //post request
        dispatch({ type: "loading" });
        try {

            const res = await fetch(`${BASE_URL}/cities`, {
                method: 'POST',
                body: JSON.stringify(newCity),
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const data = await res.json();
            dispatch({ type: 'city/created', payload: data })
        } catch {
            dispatch({
                type: "rejected",
                payload: "There was san error loading thr city....",
            });
        }
    }

    async function deleteCity(id) {
        //delete request
        dispatch({ type: "loading" });
        try {

            await fetch(`${BASE_URL}/cities/${id}`, {
                method: 'DELETE',

            });

            dispatch({ type: 'city/deleted', payload: id })
        } catch {
            dispatch({
                type: "rejected",
                payload: "There was san error deleting thr city....",
            });
        }
    }



    // async function createCity(newCity) {
    //     //post request
    //     try {
    //         setIsLoading(true);
    //         const res = await fetch(`${BASE_URL}/cities`, {
    //             method: 'POST',
    //             body: JSON.stringify(newCity),
    //             headers: {
    //                 "Content-Type": "application/json",
    //             }
    //         });
    //         const data = await res.json();
    //         setCities((cities) => [...cities, data]);
    //     } catch {
    //         alert("There was an error creating data....")
    //     } finally {
    //         setIsLoading(false);
    //     }

    // }

    // async function deleteCity(id) {
    //     //delete request
    //     try {
    //         setIsLoading(true);
    //         await fetch(`${BASE_URL}/cities/${id}`, {
    //             method: 'DELETE',

    //         });

    //         setCities((cities) => cities.filter((city) => city.id !== id));
    //     } catch {
    //         alert("There was an error deleting city....")
    //     } finally {
    //         setIsLoading(false);
    //     }

    // }

    return (
        <CitiesContext.Provider value={{
            cities,
            isLoading,
            currentCity,
            error,
            getCity,
            createCity,
            deleteCity
        }}>
            {children}
        </CitiesContext.Provider>

    );


}
function useCities() {
    const context = useContext(CitiesContext);
    if (context === undefined)
        throw new Error("CitiesContext was used outside CitiesProvider");
    return context;
}


export { CitiesProvider, useCities };