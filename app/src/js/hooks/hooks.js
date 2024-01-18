import { useHistory } from "react-router-dom";

export function useGoBack() {
    const history = useHistory()

    return function(defaultRedirection, shouldReplace = false) {
        if (shouldReplace) {
            return history.replace(defaultRedirection)
        }
        return history.length === 1 || history.location.state
		? history.push(defaultRedirection)
		: history.goBack()
    }
}

// export function useGoBackOrReplace(redirectUrl, shouldReplace = false) {
//     const history = useHistory()

//     const goBack = useGoBack(redirectUrl)

//     if (shouldReplace) {
//         history.replace(redirectUrl)
//     } else {
//         goBack()
//     }
// }
