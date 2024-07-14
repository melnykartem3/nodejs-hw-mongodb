import { contactFieldList } from '../constants/contacts.js';
import { sortOrderList } from '../constants/index.js';

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
