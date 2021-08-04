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

        & .button:hover {
            cursor: pointer;
            background-color: rgb(230, 230, 230);
        }
    `,
    Main: styled.div`
        height: 100%;

        display: grid;
        grid-template-rows: ${(props) => `${props.proportion[0]}fr ${props.proportion[1]}fr`};
        align-items: stretch;
    `,
};

function App() {
    const [sourceCodes, setSourceCodes] = useState(['', '', '']);
    const [shouldTransfer, setShouldTransfer] = useState(false);
    const [sectionsProportion, setSectionsProportion] = useState([1, 1]);

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
            <Styled.Main proportion={sectionsProportion}>
                <Editors transfer={shouldTransfer} onTransfer={getSourceCode} />

                <CodeCompiler codes={sourceCodes} />
            </Styled.Main>
        </Styled.App>
    );
}

export default App;
