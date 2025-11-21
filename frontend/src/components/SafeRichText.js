import React, { useEffect } from "react";
import DOMPurify from 'dompurify';

function SafeRichText({ content }) {
  const clean = DOMPurify.sanitize(content);
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}

export default SafeRichText;
