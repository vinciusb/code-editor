import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

import Editors from '../Editors/Editors';
import CodeCompiler from '../CodeCompiler/CodeCompiler';
import ResizeBar from '../ResizeBar/ResizeBar';
import ConfigDiv from '../ConfigDiv/ConfigDiv';
import GradientButton from '../GradientButton/GradientButton';

const minSize = 0.2;
const resBarSize = 2;

const Styled = {
    App: styled.div`
        text-align: center;
        width: 100%;
        height: 100%;

        display: flex;
        flex-flow: column;

        & .button {
            justify-self: end;
        }
        & .button:hover {
            cursor: pointer;
            background-color: rgb(230, 230, 230);
        }
        & > header {
            height: 50px;
            font-weight: bold;
            font-family: monospace;
            font-size: 2em;
            padding: 0 20px;

            display: grid;
            grid-template-columns: auto 1fr;
            align-content: center;

        }
        & > header .compile-button {
            justify-self: flex-end;
        }
    `,
    Main: styled.div`
        height: 100%;

        display: grid;
        grid-template-rows: ${({ p, h }) => {
        const sum = p[0] + p[1];
        return `${(p[0] / sum) * h}px auto ${(p[1] / sum) * h}px`;
    }};
        align-items: stretch;
    `,
};

function App() {
    const main = useRef(0);
    const [h, setH] = useState(0);
    const [w, setW] = useState(0);
    const [sourceCodes, setSourceCodes] = useState(['', '', '']);
    const [shouldTransfer, setShouldTransfer] = useState(false);
    const [sectionsProportion, setSectionsProportion] = useState([1, 1]);

    // Set on resize handler
    useEffect(() => {
        function handleResize() {
            setH(main.current.offsetHeight - resBarSize);
            setW(main.current.offsetWidth);
        }
        setH(main.current.offsetHeight - resBarSize);
        setW(main.current.offsetWidth);
        window.addEventListener('resize', handleResize);
    }, []);

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
        const headerSize = main.current.offsetTop;
        const mouseInsideDiv = mouse - headerSize < 0 ? 0 : mouse - headerSize;
        const normalizedMouse = 2 * (mouseInsideDiv / contentSize);

        // Copy proportions
        const proportions = [...sectionsProportion];

        // Set the proportions
        proportions[id] = normalizedMouse;
        proportions[id + 1] = 2 - normalizedMouse;

        // Garants Min size
        for(let i = 0; i < 2; i++) {
            if(proportions[id + i] < minSize) {
                proportions[id + i] = minSize;
                proportions[id + 1 - i] = 2 - minSize;
                break;
            }
        }
        setSectionsProportion(proportions);
    }

    return (
        <Styled.App>
            <header>
                <ConfigDiv />
                <GradientButton
                    className="compile-button"
                    text="COMPILAR"
                    fontSize={16}
                    gradStart={[255, 0, 255]}
                    gradEnd={[0, 130, 255]}
                    onClick={injectCode}
                />
            </header>
            <Styled.Main ref={main} p={sectionsProportion} h={h}>
                <Editors transfer={shouldTransfer} onTransfer={getSourceCode} w={w} />
                <ResizeBar id={0} isVertical={false} onPropChange={handleProportionsChange} />
                <CodeCompiler codes={sourceCodes} />
            </Styled.Main>
        </Styled.App>
    );
}

export default App;
