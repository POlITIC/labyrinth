const generateRandomLabyrinth = (width, height) => {
	const result = [];

	//top wall
	const topWall = [];
	for (let i = 0; i < width + 2; i++) {
		topWall.push(1);
	}
	result.push(topWall);

	for (let h = 0; h < height; h++) {
		const row = [];

		row.push(1);

		for (let w = 0; w < width; w++) {
			row.push(Math.round(Math.random() > 0.65 && 1));
		}

		row.push(1);

		result.push(row);
	}


	//bottom wall
	const bottomWall = [];
	for (let i = 0; i < width + 2; i++) {
		bottomWall.push(1);
	}
	result.push(bottomWall);


	return result;
};

const getById = (id) => {
	// TODO get labyrinth from db or some storage OR whatever

	return generateRandomLabyrinth(30, 30);
};

module.exports = {
	getById
};
