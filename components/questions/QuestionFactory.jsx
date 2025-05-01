import Image_Select from './Image_Select'; 
import Letter_Select from './Letter_Select'
import Matching_Type from './Matching_Type';
import Multiple_Select from './Multiple_Select'

const QuestionFactory = ({ type, ...props }) => {
  const normalizedType = type?.toLowerCase().replace(/[_\s]/g, '');

  switch (normalizedType) {
    case 'letterselect': // Updated from 'letter_select'
      return <Letter_Select {...props} />;
    case 'imageselect': // Updated from 'image_select'
      return <Image_Select {...props} />;
    case 'multiselect':
      return <Multiple_Select {...props} />;
    case 'matching':
      return <Matching_Type {...props} />;
    default:
      return null; // Return null instead of empty string for React components
  }
};

export default QuestionFactory;