import React, {useEffect, useState} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import style from "../markdown-styles.module.css";

function DteacherNoMB() {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    import(`../markdown/teacher/noMB.md`)
      .then(res => {
        fetch(res.default)
          .then(res => res.text())
          .then(res => setMarkdown(res))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  });

  return (
    <>
      <ReactMarkdown remarkPlugins={[remarkGfm]} className={style.reactMarkDown}>{markdown}</ReactMarkdown>
    </>
  );
}

export default DteacherNoMB
