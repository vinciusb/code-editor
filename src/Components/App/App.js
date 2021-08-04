import React, { useState } from 'react';
import styled from 'styled-components';

import Editors from '../Editors/Editors';
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
};

function App() {
    const [shouldTransfer, setShouldTransfer] = useState(false);
    const [sourceCodes, setSourceCodes] = useState(['', '', '']);

    function injectCode() {
        setShouldTransfer(true);
    }

    function getSourceCode(codes) {
        setSourceCodes(codes);
        setShouldTransfer(false);
    }

    return (
        <Styled.App>
            <header>
                <div className="button" onClick={injectCode}>RELOAD</div>
            </header>
            <main>
                <Editors transfer={shouldTransfer} onTransfer={getSourceCode} />

                <div className="CodeResult">
                    <CodeCompiler codes={sourceCodes} />
                </div>
            </main>
        </Styled.App>
    );
}

export default App;
