import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import utils from '../../Utils/utils';

const borderSize = 8;
const taPadding = 5;

const Styled = {
    CodeEditor: styled.div`
        display: flex;
        flex-flow: column;
        padding: 10px;

        & header {
            background-color: rgb(20,21,28);
            border-top-left-radius: ${borderSize}px;
            border-top-right-radius: ${borderSize}px;
            padding: 3px 10px 0 10px;

            display: flex;
            align-items: center;
        }
        & h1 {
            margin: 0;
            user-select: none;
        }
        & img {
            height: 35px;
            width: auto;
            margin-right: 10px;
        }
        & .editor {
            font-size: ${(props) => `${props.fontSize}px`};
            border-bottom-left-radius: ${borderSize}px;
            border-bottom-right-radius: ${borderSize}px;
            width: 100%;
            height: 100%;
            overflow: hidden;

            display: flex;
        }
        & .line-indicator {
            background-color: red;
            height: 100%;
            min-width: 1.3em;
            user-select: none;
            padding: 2px 5px 3px 1px;

            display: flex;
            flex-flow: column;
            align-items: flex-end;
        }
        & .line-number {
            line-height: 1em;
        }
        & textarea{
            font-size: ${(props) => `${props.fontSize}px`};;
            font-family: ${(props) => `${props.font}`};
            font-weight: bolder;
            line-height: 1em;
            width: 100%;
            resize: none;
            padding: 2px ${taPadding}px;
            border: none;
        }
        & textarea:focus {
            outline: none;
        }
        & textarea::-webkit-scrollbar {
            width: 6px;
            margin-right: 20px;
            background-color: #F5F5F5;
        }

        & textarea::-webkit-scrollbar-thumb {
            border-radius: 4px;
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
            background-color: rgb(60,63,84);
            border: 1px solid white;
        }
    `,
};
function CodeEditor({
    id, lang, code, logo, onTextChange, font, size,
}) {
    const editor = useRef();
    const [linesNumbers, setLinesNumbers] = useState(1);
    const [multilinesNumbers, setMultilinesNumbers] = useState([[0, 0]]);
    // 1st el.: start line, 2nd: how much lines occuppies

    function calcMultiLines(e) {
        const editorSize = editor.current.clientWidth - 2 * taPadding;
        const sizes = utils.calcTextWidths(font, size, e.target.value);

        let list = [];
        sizes.forEach((elSize, index) => {
            const proportion = Math.ceil(elSize / editorSize);
            if(proportion > 1) list.push([index + 1, index + proportion]);
        });
        // If the list is empty
        if(list.length === 0) list = [[0, 0]];
        setMultilinesNumbers(list);
    }

    function updateLineNumber(increase) {
        let newLines = linesNumbers;
        if(increase) {
            newLines += 1;
        }
        else if(linesNumbers > 1) {
            newLines -= 1;
        }
        setLinesNumbers(newLines);
    }

    function changeLinesCount(e, lastCode, currentCode) {
        const { inputType } = e.nativeEvent;
        // If increased the line number
        if(inputType === 'deleteContentBackward') {
            const dif = utils.getStringFirstDif(lastCode, currentCode);
            if(dif === '\n') updateLineNumber(false);
        }
        // If decreased the line number
        else if(inputType === 'insertLineBreak') {
            updateLineNumber(true);
        }
    }

    function handleTextChange(e) {
        onTextChange(e, id);

        // Deals with line count change:
        // Update the lines count
        changeLinesCount(e, code, e.target.value);

        // Find the multi lines
        calcMultiLines(e);
    }

    function renderLineNumbers() {
        const list = [];
        let multiIndex = 0;

        for(let i = 1; i <= linesNumbers; i++) {
            list.push(
                <div className="line-number">{ i }</div>,
            );
            // If it's the multiline
            if(i === multilinesNumbers[multiIndex][0]) {
                for(let j = multilinesNumbers[multiIndex][0] + 1;
                    j <= multilinesNumbers[multiIndex][1]; j++) {
                    list.push(
                        <div className="line-number">·</div>,
                    );
                }
                // Verify if there is a next multiline
                if(multilinesNumbers.length - multiIndex > 1) {
                    multiIndex += 1;
                }
            }
        }
        return list;
    }

    return (
        <Styled.CodeEditor font={font} fontSize={size}>
            <header>
                <img src={logo} alt="" />
                <h1>{ lang.toUpperCase() }</h1>
            </header>
            <div className="editor">
                <div className="line-indicator">
                    { renderLineNumbers() }
                </div>
                <textarea
                    id={`${lang}-editor`}
                    value={code}
                    onChange={handleTextChange}
                    ref={editor}
                    spellCheck="false"
                />
            </div>
        </Styled.CodeEditor>
    );
}

/* TODO: - aplicar scroll na div do editor toda
        - aplicar style pra palavras especiais
        - Quando exclui um conjunto de conteudo, fazer com que a numeração
            das linhas mudem tb, e.g. fzr com q a função de diferença de string
            pegue todas as diferenças e contar qnts \n tem dentro da diferença */

CodeEditor.propTypes = {
    id: PropTypes.number.isRequired,
    lang: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    logo: PropTypes.element.isRequired,
    onTextChange: PropTypes.func.isRequired,

    font: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
};

export default CodeEditor;
