import React from 'react';
import MultipleChoice_One from './MultipleChoice_One';
import HandRecognition from './HandRecognition';
import MultipleChoiceTwo from './MultipleChoiceTwo';
import MultipleChoiceThree from './MultipleChoiceThree';

const QuestionFactory = ({ type, ...props }) => {
  switch(type.toLowerCase()) { // Handle case variations
    case 'hand-recognition':
      return <HandRecognition {...props} />;
    case 'multiple-choiceone':
      return <MultipleChoice_One {...props} />;
    case 'multiple-choicetwo':
      return <MultipleChoiceTwo {...props} />;
    case 'multiple-choicethree':
      return <MultipleChoiceThree {...props} />;
    default:
      return <MultipleChoice_One {...props} />;
  }
};

export default QuestionFactory;