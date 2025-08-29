function create_category_object(
  currentLine,
  currentCategoryObject,
  JSONObject
) {
  const currentCategory = currentLine.split(": ")[1].toString();
  const currentCategoryFormatted = currentCategory.split(" ")[0];
  JSONObject["categories"].push({ id: currentCategoryFormatted });
  currentCategoryObject = JSONObject["categories"].at(-1);
  currentCategoryObject.items = [];
  return currentCategoryObject;
}

module.exports = create_category_object;
