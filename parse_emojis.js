const fs = require("fs");

const emojiFileContent = fs.readFileSync("emoji-test.txt", "utf8");
const emojiFileContentArray = emojiFileContent.split("\n");
const JSONObject = { categories: [] };

const parseEmojiMetadata = (input) => {
	const regex = /^\d+\.\d+\s+(.*)$/;
	const match = input.match(regex);
	return match ? match[1] : null;
};

let currentCategoryFormatted;
let currentCategoryObject;
let previousEmojiName;
let currentEmojiObject;

for (const line of emojiFileContentArray) {
	let currentCategory;
	if (line === "") {
		continue;
	}
	if (line.startsWith("# group")) {
		currentCategory = line.split(": ")[1].toString();
		currentCategoryFormatted = currentCategory.split(" ")[0];
		JSONObject["categories"].push({ id: currentCategoryFormatted });
		currentCategoryObject = JSONObject["categories"].at(-1);
		currentCategoryObject.items = [];
	}
	if (!line.startsWith("#")) {
		const lineContent = line.split(";")[1];
		const lineContentSplit = lineContent.split("#");
		const qualification = lineContentSplit[0].trim();
		const emojiInfoNull = lineContentSplit[1] === " ";
		const emojiInfo = !emojiInfoNull ? lineContentSplit[1] : lineContentSplit[2];
		if (qualification === "fully-qualified") {
			const emojiInfoSplit = emojiInfo.split("E");
			const emoji = emojiInfoSplit[0].trim();
			const emojiMetadata = emojiInfoSplit[1];
			const emojiMetadataSplit = emojiMetadata.split(":");
			const emojiName = parseEmojiMetadata(emojiMetadataSplit[0]);
			const skinTone = emojiMetadataSplit[1]?.split("skin tone")[0];

			if (emojiName !== "flag" && previousEmojiName !== emojiName) {
				currentCategoryObject.items.push({
					id: emojiName,
					emoji: emoji,
					variants: []
				});
				currentEmojiObject = currentCategoryObject.items.at(-1);
			} else {
				currentEmojiObject.variants.push({
					emoji: emoji,
					id: emojiName,
					skinTone: skinTone
				});
			}
			previousEmojiName = emojiName;
		}
	}
}

const jsonString = JSON.stringify(JSONObject, null, 2);
fs.writeFileSync("emojis-test.json", jsonString);
