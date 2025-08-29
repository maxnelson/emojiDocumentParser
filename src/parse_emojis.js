const fs = require("fs");
const create_category_object = require("./create_category_object");
const remove_decimal_number = require("./utilities/utility_functions");

const emojiFileContent = fs.readFileSync("./content/emoji-test.txt", "utf8");
const emojiFileContentArray = emojiFileContent.split("\n");
const JSONObject = { categories: [] };

let currentCategoryObject;
let currentEmojiObject;

for (const line of emojiFileContentArray) {
	if (line === "") {
		continue;
	}
	if (line.startsWith("# group")) {
		currentCategoryObject = create_category_object(line, currentCategoryObject, JSONObject);
		currentCategoryObject = currentCategoryObject.items;
	}
	if (!line.startsWith("#")) {
		//REMOVE HEXIDECIMAL CODE POINT
		const lineContent = line.split(";")[1];
		//SPLIT INTO QUALIFICATION AND EMOJI INFO
		const lineContentSplit = lineContent.split("#");
		//FILTER OUT UNQUALIFIED EMOJIS
		if (lineContentSplit[0].trim() === "fully-qualified") {
			//NEED THIS SPECIFCALLY TO ACCOUNT FOR THE #️⃣ EMOJI WHICH MATCHES ON "#" AND SPLITS THE LINECONTENT INTO 3 STRINGS INSTEAD OF 2 STRINGS.
			let emojiInfo = lineContentSplit[1];
			const emojiInfoEmpty = emojiInfo === " ";
			emojiInfo = !emojiInfoEmpty ? lineContentSplit[1] : lineContentSplit[2];
			//SPLIT INTO EMOJI AND METADATA
			const emojiInfoSplit = emojiInfo.split("E");
			const emoji = emojiInfoSplit[0].trim();
			//SPLIT INTO EMOJI AND METADATA
			const emojiMetadataSplit = emojiInfoSplit[1]?.split(":");
			//REMOVE DECIMAL NUMBER FROM EMOJI NAME
			let emojiName = remove_decimal_number(emojiMetadataSplit[0]).split(" ").join("-");
			let emojiID;

			let currentEmojiObject = {
				emoji: emoji,
				variants: []
			};
			//If contains skin tone, put it under variants
			if (emojiMetadataSplit.length === 1) {
				emojiID = emojiName;
			} else {
				count1++;
				emojiID =
					emojiName +
					"-" +
					emojiMetadataSplit[1].trim().replaceAll(",", "").replaceAll(" ", "-");
			}
			if (emojiID.includes("skin-tone")) {
				currentEmojiObject.variants.push();
			} else console.log(emojiMetadataSplit);
			console.log(emojiID);
			//console.log(currentCategoryObject);
			/*
			if (emojiID.includes("skin-tone")) {
				currentEmojiObject.variants = [];
				currentCategoryObject = currentEmojiObject.variants;
			}
			currentEmojiObject.id = emojiID;
			currentCategoryObject.push(currentEmojiObject);
      */
			//console.log(emojiID);

			/*
      console.log("DELIMITER");
      console.log(emojiMetadataSplit.length);
      console.log(emojiMetadataSplit[0]);
      console.log(emojiMetadataSplit[1]);
      let emojiDescription = emojiMetadataSplit[1];
      let skinTone = "";
      let emojiNameLong = "";
      const skinToneExists = emojiDescription?.includes("skin tone");
      if (emojiDescription) {
        emojiNameLong = emojiName + "-" + emojiDescription?.trim();
      }
      if (skinToneExists) {
        skinTone = emojiDescription
          ?.split("skin tone")
          .join("")
          .replaceAll(",", "")
          .replaceAll(" ", "-");
        emojiNameLong = emojiNameLong.split(" skin tone")[0];
      }
      console.log(currentCategoryObject);
      if (emojiName === "flag") {
        currentCategoryObject = currentCategoryObject.items.at(-1);
      } else if (previousEmojiName !== emojiName) {
      } else {
        //DO NOTHING
      }
      const currentEmojiObject = {
        emoji: emoji,
        id: emojiNameLong || emojiName,
        variants: [],
      };
      console.log(emojiMetadataSplit);
      console.log(currentCategoryObject);
      currentCategoryObject.items.push(currentEmojiObject);
      previousEmojiName = emojiName;
      */
		}
	}
}

const jsonString = JSON.stringify(JSONObject, null, 2);
fs.writeFileSync("../emoji-test.json", jsonString);
