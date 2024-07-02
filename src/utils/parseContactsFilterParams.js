import { contactTypeList } from '../constants/contacts-constants.js';

const parseBoolean = (value) => {
  if (typeof value !== 'string') return;

  if (!['true', 'false'].includes(value)) return;

  if (value === 'true') return true;
  if (value === 'false') return false;
};

const parseContactsFilterParams = ({ type, isFavourite }) => {
  const parsedType = contactTypeList.includes(type) ? type : null;
  const parsedFavourite = parseBoolean(isFavourite);

  return {
    type: parsedType,
    isFavourite: parsedFavourite,
  };
};

export default parseContactsFilterParams;
