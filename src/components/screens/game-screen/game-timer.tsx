import { usePausedState } from '@/atoms';
import { useRxData, } from 'rxdb-hooks';
import { useInterval } from '@/hooks';
import FormattedTime from '@/components/formatted-time';
import { updateTime } from '@/core';

interface Props {
	gameComplete?: boolean;
}

export default
function GameTimer(props: Props) {
	const { gameComplete } = props;
	const [paused] = usePausedState();
	const { result: gameData  } = useRxData<{id: string; value: number}>('gamedata', collection => collection.find({ selector: { id: 'time' } }));
	const time = gameData?.find(doc => doc.id === 'time');
	const runTimer = time && !gameComplete && !paused;

	useInterval(() => {
		if(!time) {
			return;
		}

		updateTime(time.value + 1);
	}, runTimer ? 1000 : null);

	if(!time) {
		return null;
	}

	return (
		<FormattedTime label="Time:" value={time.value} />
	);
}
