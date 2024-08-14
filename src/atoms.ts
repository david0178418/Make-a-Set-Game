'use client';

import { atom, useAtom, useSetAtom } from 'jotai';
import { ToastMesssage } from './types';

export
const pausedAtom = atom(false);

export
function usePausedState() {
	return useAtom(pausedAtom);
}

const toastQueueAtom = atom<ToastMesssage[]>([]);

export
const toastMsgAtom = atom(get => get(toastQueueAtom)[0] || null);

export
const pushToastMsgAtom = atom(
	null,
	(get, set, message: ToastMesssage | string) => {

		const addedMsg = (typeof message === 'string') ? { message } : message;

		const tqa = get(toastQueueAtom);

		set(toastQueueAtom, [ ...tqa, addedMsg ]);
	},
);

export
const clearCurrentToastMsgAtom = atom(
	null,
	(get, set) => {
		const tqa = get(toastQueueAtom);
		tqa.shift();

		set(toastQueueAtom, [ ...tqa ]);
	},
);

export
function usePushToastMsg() {
	return useSetAtom(pushToastMsgAtom);
}
