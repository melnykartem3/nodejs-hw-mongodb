import { contactFieldList } from '../constants/contacts-constants.js';
import { sortOrderList } from '../constants/sortOrderList.js';

const parseSortParams = ({ sortOrder, sortBy }, fieldList) => {
  const parsedSortOrder = sortOrderList.includes(sortOrder)
    ? sortOrder
    : sortOrderList[0];
  const parsedSortBy = fieldList.includes(sortBy)
    ? sortBy
    : contactFieldList[0];

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};

export default parseSortParams;
