import React, { useState } from 'react';
import styled from 'styled-components';

import CodeEditor from '../CodeEditor/CodeEditor';
import CodeCompiler from '../CodeCompiler/CodeCompiler';

const Styled = {
    App: styled.div`
    text-align: center;
    width: 100%;
    height: 100%;

    display: flex;
    flex-flow: column;

    & > main {
      height: 100%;
    }
    & .button:hover {
      cursor: pointer;
      background-color: rgb(230, 230, 230);
    }
    & .CodeResult {
      background-color: blue;
      height: 50%;
    }
  `,
    Editors: styled.div`
    background-color: red;
    height: 50%;

    display: grid;
    grid-template-columns: ${(props) => `${props.proportion[0]}fr ${props.proportion[1]}fr ${props.proportion[2]}fr`};
    justify-content: stretch;
  `,
};

function App() {
    const [isTransferCode, setIsTransferCode] = useState(false);
    const [sourceCodes, setSourceCodes] = useState(['', '', '']);
    const [editorsProportion, setEdProportion] = useState([1, 1, 1]);

    function injectCode() {
        setIsTransferCode(true);
    }

    function getSourceCode(code, id) {
        const newCode = sourceCodes.map((element, i) => (i === id ? code : element));
        setSourceCodes(newCode);
    }

    function renderCodeEditors() {
        const list = [];
        const infos = [
            { lang: 'html', logo: null },
            { lang: 'css', logo: null },
            { lang: 'js', logo: null },
        ];
        infos.forEach((obj, i) => {
            list.push(
                <CodeEditor
                    key={i}
                    id={i}
                    lang={obj.lang}
                    logo={obj.logo}
                    handleCodeTransfer={getSourceCode}
                    shouldTransfer={isTransferCode}
                />,
            );
        });

        return list;
    }

    return (
        <Styled.App>
            <header>
                <div className="button" onClick={injectCode}>RELOAD</div>
            </header>
            <main>
                <Styled.Editors proportion={editorsProportion}>
                    {renderCodeEditors()}
                </Styled.Editors>

                <div className="CodeResult">
                    <CodeCompiler sourceCodes />
                </div>
            </main>
        </Styled.App>
    );
}

export default App;
