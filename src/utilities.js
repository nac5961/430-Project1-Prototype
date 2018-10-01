//Helper function used for sorting the games
const compare = (a, b) => {
	
	const nameA = a.name;
	const nameB = b.name;
	
	//a comes before b
	if (nameA > nameB){
		return 1;
	}
	
	//b comes before a
	else if (nameA < nameB){
		return -1;
	}
	
	//same
	return 0;
};

//Helper function used for reverse sorting the games
const reverseCompare = (a, b) => {
	return compare(a, b) * -1;
};

//Function to sort the games
const sortGamesArr = (games) => {
	games.sort(compare);
};

//Function to reverse sort the games
const reverseSortGamesArr = (games) => {
	games.sort(reverseCompare);
};

//Export the functions (make them public)
module.exports.sortGamesArr = sortGamesArr;
module.exports.reverseSortGamesArr = reverseSortGamesArr;
