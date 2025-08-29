const fs = require("fs");
const create_category_object = require("./create_category_object");
const remove_decimal_number = require("./utilities/utility_functions");

const emojiFileContent = fs.readFileSync("./content/emoji-test.txt", "utf8");
const emojiFileContentArray = emojiFileContent.split("\n");
const JSONObject = { categories: [] };

let currentCategoryObject;
let previousEmojiName;

for (const line of emojiFileContentArray) {
  if (line === "") {
    continue;
  }
  if (line.startsWith("# group")) {
    currentCategoryObject = create_category_object(
      line,
      currentCategoryObject,
      JSONObject
    );
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
      let emojiName = remove_decimal_number(emojiMetadataSplit[0])
        .split(" ")
        .join("-");
      let emojiDescription = emojiMetadataSplit[1];
      let skinTone = "";
      let emojiNameLong = "";
      //CHECK IF SKIN TONE EXISTS
      console.log(emojiMetadataSplit);
      const skinToneExists = emojiDescription?.includes("skin tone");
      //CHECK IF EMOJI DESCRIPTION EXISTS
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
      if (emojiName === "man") {
        //console.log(emojiNameLong);
      }

      const currentEmojiObject = {
        emoji: emoji,
        id: emojiNameLong || emojiName,
        variants: [],
      };
      if (emojiName === "flag") {
        currentCategoryObject.items.push({
          id: emojiName + " - " + emojiDescription?.trim(),
          emoji: emoji,
          variants: [],
        });
      } else if (previousEmojiName !== emojiName) {
        currentCategoryObject.items.push({
          id: emojiNameLong || emojiName,
          emoji: emoji,
          variants: [],
        });
      } else {
        currentCategoryObject.items.at(-1).variants.push({
          emoji: emoji,
          id: emojiNameLong + "-" + skinTone,
          skinTone: skinTone,
        });
      }
      previousEmojiName = emojiName;
    }
  }
}

const jsonString = JSON.stringify(JSONObject, null, 2);
fs.writeFileSync("../emoji-test.json", jsonString);
