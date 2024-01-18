import { useHistory } from "react-router-dom";

export function useGoBack(defaultRedirection) {
    const history = useHistory()

    return function() {
        return history.length === 1 || history.location.state
		? history.push(defaultRedirection)
		: history.goBack()
    }
}

export function useGoBackOrReplace(redirectUrl, shouldReplace = false) {
    const history = useHistory()

    const goBack = useGoBack(redirectUrl)

    if (shouldReplace) {
        history.replace(redirectUrl)
    } else {
        goBack()
    }
}
