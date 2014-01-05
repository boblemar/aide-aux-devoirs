function isNumericKeCode(keyCode) {
	return (
				(
					(keyCode >= 48) &&
					(keyCode <= 57)
				) ||
				(
					(keyCode >= 96) &&
					(keyCode <= 105)
				)
			);
}

function isArrowUpKeyCode(keyCode) {
	return keyCode === 38;
}

function isArrowDownKeyCode(keyCode) {
	return keyCode === 40;
}

function isArrowLeftKeyCode(keyCode) {
	return keyCode === 37;
}

function isArrowRightKeyCode(keyCode) {
	return keyCode === 39;
}