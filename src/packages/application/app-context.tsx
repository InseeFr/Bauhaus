import { createContext, PropsWithChildren, useContext, useState } from 'react';

type AppContextTypes = {
	lg1: string;
	lg2: string;
	version?: string;
	secondLang: {
		value: boolean;
		toggle: () => void;
	};
};

const AppContext = createContext<AppContextTypes | undefined>(undefined);

export const AppContextProvider = ({
	lg1,
	lg2,
	version,
	children,
}: PropsWithChildren<Pick<AppContextTypes, 'lg1' | 'lg2' | 'version'>>) => {
	const [secondLang, setSecondLang] = useState(false);

	return (
		<AppContext.Provider
			value={{
				lg1,
				lg2,
				secondLang: {
					value: secondLang,
					toggle: () => setSecondLang((value) => !value),
				},
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
export const useAppContext = (): AppContextTypes => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error('The context AppContextTypes is not available.');
	}
	return context;
};
