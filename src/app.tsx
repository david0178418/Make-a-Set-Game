import './styles.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Game from './components/game';
import Toast from './components/toast';
import ReactGA from "react-ga4";
import HelpDialogTrigger from './components/help-dialog-trigger';
import { Provider } from 'rxdb-hooks';
import { useEffect, useState } from 'react';
import { AsyncReturnType } from './types';
import { initialize } from './core';

const {
	DEV,
	PROD,
	VITE_GOOGLE_ANALYTICS_ID = '',
} = import.meta.env;

if (PROD && VITE_GOOGLE_ANALYTICS_ID) {
	ReactGA.initialize(VITE_GOOGLE_ANALYTICS_ID);
}

if(DEV) {
	Promise.all([
		import('rxdb/plugins/dev-mode'),
		import('rxdb'),
	]).then(([{ RxDBDevModePlugin }, { addRxPlugin }]) => {
		console.log('Adding RxDB dev mode plugin');
		addRxPlugin(RxDBDevModePlugin);
	});
}

export default
function App() {
	const [db, setDb] = useState<AsyncReturnType<typeof initialize>>();

	useEffect(() => {
		initialize().then(setDb);
	}, []);

	return (
		<Provider db={db}>
			<Game />
			<Toast />
			<HelpDialogTrigger />
		</Provider>
	);
}
