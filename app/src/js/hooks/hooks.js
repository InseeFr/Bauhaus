import { useHistory } from "react-router-dom";

export function useGoBack() {
    const history = useHistory()

    return function() {
        return history === true
    }
}

export function useGoBackOrReplace() {
    const history = useHistory()

    return function() {
        return history === true
    }
}
