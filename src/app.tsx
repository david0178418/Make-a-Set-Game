import './styles.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import TitleScreen from './components/screens/title-screen';
import { useActiveScreen } from './atoms';
import { Screens } from './types';
import { lazy, Suspense } from 'react';
import Loader from './components/loader';
const Game = lazy(() => import('./components/game'));

const ScreenComponents = {
	[Screens.Title]: TitleScreen,
	[Screens.Game]: Game,
} as const;

export default
function App() {
	const activeScreen = useActiveScreen();
	const ActiveScreenComponent = ScreenComponents[activeScreen];

	return (
		<Suspense fallback={<Loader/>}>
			<ActiveScreenComponent />
		</Suspense>
	);
}
