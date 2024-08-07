import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { randomizeArray } from './utils';
import {
	createRxDatabase,
	RxCollection,
	RxJsonSchema,
} from 'rxdb';
import {
	BitwiseValue,
	Card,
	Colors,
	Counts,
	Fills,
	SetOrders,
	Shapes,
} from './types';

export
function setExists(cards: Card[]) {
	if(cards.length < 3) {
		return false;
	}

	for(let a = 0; a < cards.length - 2; a++) {
		for(let b = a + 1; b < cards.length - 1; b++) {
			for(let c = b + 1; c < cards.length; c++) {
				// @ts-ignore
				if(isSet(cards[a], cards[b], cards[c])) {
					return true;
				}
			}
		}
	}

	return false;
}

export
function isSet(a: Card, b: Card, c: Card) {
	return (
		allSameOrDifferent(a.color, b.color, c.color) &&
		allSameOrDifferent(a.fill, b.fill, c.fill) &&
		allSameOrDifferent(a.shape, b.shape, c.shape) &&
		allSameOrDifferent(a.count, b.count, c.count)
	);
}

export
function allSameOrDifferent(a: BitwiseValue, b: BitwiseValue, c: BitwiseValue) {
	return (
		// all are the same (bits AND to 'a'")
		((a & b & c) == a) ||
		// all are different (bits OR to '111' (7)")
		((a | b | c) == 7)
	);
}

interface DbCollections {
	setorders: RxCollection<SetOrders>;
	gamedata: RxCollection<{id: string; value: number;}>;
}

export
async function initialize() {
	const GameDataSchema: RxJsonSchema<{id: string; value: number;}> = {
		version: 0,
		primaryKey: 'id',
		type: 'object',
		properties: {
			id: {
				type: 'string',
				maxLength: 24,
			},
			value: {
				type: 'number',
			},
		},
	};
	const SetOrdersSchema: RxJsonSchema<SetOrders> = {
		version: 0,
		primaryKey: 'name',
		type: 'object',
		properties: {
			name: {
				type: 'string',
				maxLength: 12,
			},
			order: {
				type: 'array',
				items: {
					type: 'string',
				},
			},
		},
	};

	const db = await createRxDatabase<DbCollections>({
		name: 'make-a-set-v0',
		storage: getRxStorageDexie()
	});

	if(db.collections.setorders) {
		return db;
	}

	await db.addCollections({
		gamedata: {
			schema: GameDataSchema,
		},
		setorders: {
			schema: SetOrdersSchema,
		},
	});

	if(await db.setorders.count().exec()) {
		return db;
	}

	db.setorders.insert({
		name: 'deck',
		order: generateDeck(),
	});

	db.setorders.insert({
		name: 'discard',
		order: [],
	});

	db.gamedata.insert({
		id: 'time',
		value: 0,
	});

	return db;
}

export
function generateDeck() {
	const newDeck: string[] = [];

	Object.values(Fills).forEach(fill => {
		Object.values(Colors).forEach(color => {
			Object.values(Shapes).forEach(shape => {
				Object.values(Counts).forEach(count => {
					newDeck.push(
						JSON.stringify({
							fill,
							color,
							shape,
							count,
						}),
					);
				});
			});
		});
	});

	return randomizeArray(newDeck);
}
