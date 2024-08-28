// src/utils/array.js

export const convertArrayToFirestoreFormat = (array2D) => {
  console.log("array2D", array2D);
  if (!Array.isArray(array2D)) {
    throw new Error("Input is not a 2D array");
  }

  return array2D.map((row, rowIndex) => {
    if (!Array.isArray(row)) {
      console.error(`Row ${rowIndex} is not an array:`, row);
      throw new Error(`Row ${rowIndex} is not an array`);
    }

    let rowObject = {};
    row.forEach((cell, colIndex) => {
      rowObject[`col${colIndex}`] = cell;
    });
    return rowObject;
  });
};

export const convertChangesToFirestoreFormat = (changes, originalData) => {
  // Clone the original data so we don't mutate it directly
  const updatedData = [...originalData];

  changes.forEach(({ row, col, newValue }) => {
    // Ensure the row exists in the array
    if (!Array.isArray(updatedData[row])) {
      updatedData[row] = [];
    }

    // Update the specific cell with the new value
    updatedData[row][col] = newValue;
  });

  // Now convert the updated 2D array to Firestore format
  return convertArrayToFirestoreFormat(updatedData);
};

export const convertFirestoreFormatToArray = (firestoreData) => {
  console.log("firestoreData", firestoreData);
  if (!Array.isArray(firestoreData)) {
    throw new Error("Input is not an array of objects");
  }

  return firestoreData.map((rowObject, rowIndex) => {
    if (typeof rowObject !== "object" || rowObject === null) {
      throw new Error(`Row object ${rowIndex} is not an object`);
    }

    return Object.keys(rowObject).map((key) => rowObject[key]);
  });
};
