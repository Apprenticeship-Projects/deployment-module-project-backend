/**
 * @param span A string representing a period of time - e.g. "30d", "2w", "15h" - if no unit is given seconds are used.
 * @returns Timespan in milliseconds
 */
const parseTimespan = (span: string): number | null => {
	span = span.trim();
	let value = parseInt(span);
	if (isNaN(value)) return null;
	const unit = span.substring(value.toString().length).toLowerCase();
	switch (unit) {
		case "w":
			value *= 60 * 60 * 24 * 7;
			break;
		case "d":
			value *= 60 * 60 * 24;
			break;
		case "h":
			value *= 60 * 60;
			break;
		case "m":
			value *= 60;
			break;
		case "s":
			value *= 1;
			break;
	}
	return value * 1000;
};

export default parseTimespan;
