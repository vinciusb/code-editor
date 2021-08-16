import React, { useState, useRef } from 'react';
import styled from 'styled-components';

import Editors from '../Editors/Editors';
import CodeCompiler from '../CodeCompiler/CodeCompiler';
import ResizeBar from '../ResizeBar/ResizeBar';

const headerSize = 25;

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
        & > header {
            height: ${headerSize}px;
            font-weight: bold;
            font-family: monospace;
            font-size: 2em;
        }
        & > header div {
            height: 100%
        }
    `,
    Main: styled.div`
        height: 100%;
        max-height: 100%;

        display: grid;
        grid-template-rows: ${(props) => `${props.proportion[0]}fr auto ${props.proportion[1]}fr`};
        align-items: stretch;
    `,
};

/* TODO: -Fazer scroll vertical diminuir mesmo com editor maior do q deveria (fazer virar scoll)
*/

function App() {
    const main = useRef();
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

    function handleProportionsChange(mouse, id) {
        // Mouse and Content size ignoring paddings and header
        const contentSize = main.current.clientHeight;
        const mouseInsideDiv = mouse - headerSize;
        const normalizedMouse = 2 * (mouseInsideDiv / contentSize);

        // Copy proportions
        const proportions = [...sectionsProportion];

        // Set the proportions
        proportions[id] = normalizedMouse;
        proportions[id + 1] = 2 - normalizedMouse;

        setSectionsProportion(proportions);
    }

    return (
        <Styled.App>
            <header>
                <div className="button" onClick={injectCode}>LOAD CODE</div>
            </header>
            <Styled.Main ref={main} proportion={sectionsProportion}>
                <Editors transfer={shouldTransfer} onTransfer={getSourceCode} />
                <ResizeBar id={0} isVertical={false} onPropChange={handleProportionsChange} />
                <CodeCompiler codes={sourceCodes} />
            </Styled.Main>
        </Styled.App>
    );
}

export default App;
