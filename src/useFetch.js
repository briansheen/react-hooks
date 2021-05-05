import { useState, useEffect } from 'react'

// loading state
// data result state
// error state
export function useFetch({ uri, login }) {
    const [loading, setLoading] = useState();
    const [result, setResult] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        if (!uri || !login) {
            return 
        }
        setLoading(true);
        fetch(uri + login)
            .then(response => response.json())
            .then(response => {
                setResult(response);
                setLoading(false);
            })
            .catch(e => {
                setError(e);
                setLoading(false);
            })
        }, [uri, login]
    )

    return { loading, result, error };
}
