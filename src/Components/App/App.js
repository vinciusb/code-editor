import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { saveAs } from 'file-saver';

import Editors from '../Editors/Editors';
import CodeCompiler from '../CodeCompiler/CodeCompiler';
import ResizeBar from '../ResizeBar/ResizeBar';
import ConfigDiv from '../ConfigDiv/ConfigDiv';
import GradientButton from '../GradientButton/GradientButton';

const minSize = 0.2;
const resBarSize = 2;
const allowedExt = ['html', 'css', 'js'];

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
    const [editorConfigs, setEditorConfigs] = useState(['Monospace', 16, 4]);
    const [importInfo, setImportInfo] = useState({ state: false, index: -1, text: '' });
    const [exportInfo, setExportInfo] = useState({ state: false });

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

    function applyConfigs(newConfig) {
        setEditorConfigs(newConfig);
    }

    function importFiles(e) {
        const file = e.target.files[0];
        // If file exists
        if(file) {
            const fileExt = file.name.split('.').pop();

            // If the extension is one of the alloweds
            if(allowedExt.some((ext) => ext === fileExt)) {
                const reader = new FileReader();
                reader.readAsText(file, 'UTF-8');

                // On file load success
                reader.onload = (ev) => {
                    setImportInfo({
                        state: true,
                        index: allowedExt.indexOf(fileExt),
                        text: ev.target.result,
                    });
                };
                // On file load error
                reader.onerror = (ev) => {
                    console.log('Error on file load');
                };
            }
            // Extension not allowed
            else {
                console.log('Extension not allowed');
            }
        }
    }

    function handleImportEnd() {
        setImportInfo({
            state: false,
            index: -1,
            text: '',
        });
    }

    function exportFiles(e) {
        injectCode();
        const expInfo = { state: true };
        setExportInfo(expInfo);
    }

    // Export the files
    useEffect(() => {
        if(exportInfo.state) {
            const htmlFile = new File([sourceCodes[0]], 'index.html', { type: 'text/plain;charset=utf-8' });
            const cssFile = new File([sourceCodes[1]], 'index.css', { type: 'text/plain;charset=utf-8' });
            const jsFile = new File([sourceCodes[2]], 'index.js', { type: 'text/plain;charset=utf-8' });
            saveAs(htmlFile);
            saveAs(cssFile);
            saveAs(jsFile);
        }
    }, [sourceCodes]);

    return (
        <Styled.App>
            <header>
                <ConfigDiv
                    configs={editorConfigs}
                    applyConf={applyConfigs}
                    importFiles={importFiles}
                    exportFiles={exportFiles}
                />
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
                <Editors
                    transfer={shouldTransfer}
                    onTransfer={getSourceCode}
                    w={w}
                    configs={editorConfigs}
                    importInfo={importInfo}
                    onImportEnd={handleImportEnd}
                />
                <ResizeBar id={0} isVertical={false} onPropChange={handleProportionsChange} />
                <CodeCompiler codes={sourceCodes} />
            </Styled.Main>
        </Styled.App>
    );
}

export default App;
